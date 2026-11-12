import {
  Controller,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RootGuard } from '../auth/root.guard';
import { SyncService } from '../sync/sync.service';
import { createDeliveryDeduper, isWebhookSecretConfigured, verifyWebhookSignature } from './webhook-signature.util';

// GitHub webhook 原始字节挂在 request.rawBody（main.ts 的 json verify 回调写入）
type WebhookRequest = Request & { rawBody?: Buffer };

function buildDispatchBody(issueNumber: number, repo: string): string {
  return JSON.stringify({
    event_type: 'archive-change',
    client_payload: {
      'change-name': issueNumber.toString(),
      'project-repo': repo,
    },
  })
}

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  private logger = new Logger(WebhookController.name);
  private readonly deduper = createDeliveryDeduper();

  constructor(
    private syncService: SyncService,
    private configService: ConfigService,
  ) {}

  @Post('github')
  @ApiOperation({ summary: 'Handle GitHub webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  @ApiResponse({ status: 400, description: 'Invalid signature' })
  async handleGitHubWebhook(@Req() request: WebhookRequest, @Body() payload: any) {
    // 密钥未配置时公网端点等于无签名裸奔——fail-fast 拒绝处理（P1-1）
    const secret = this.configService.get<string>('GITHUB_WEBHOOK_SECRET');
    if (!isWebhookSecretConfigured(secret)) {
      this.logger.error('GITHUB_WEBHOOK_SECRET not configured; rejecting webhook request');
      throw new ServiceUnavailableException('Webhook secret not configured');
    }

    // 重放防护：同一 delivery id 在窗口内只处理一次
    const deliveryId = request.headers['x-github-delivery'] as string | undefined;
    if (deliveryId && this.deduper.seen(deliveryId)) {
      this.logger.log(`Duplicate delivery ${deliveryId}, skipped`);
      return { success: true, deduped: true };
    }

    // 签名必须对原始请求字节校验（GitHub 对 raw body 计算 HMAC；re-serialize 的 JSON
    // 存在转义/空白差异风险），比较用 timingSafeEqual 防时序侧信道（P1-1）
    const rawBody = request.rawBody;
    const signature = request.headers['x-hub-signature-256'] as string | undefined;
    if (!rawBody || !verifyWebhookSignature(signature, rawBody, secret)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const { action, issue, comment } = payload;

    try {
      if (payload.action === 'deleted') {
        // GitHub 侧删除的 issue/comment 本地同步移除（审计 P1-3：删除此前永久漂移）
        if (payload.comment?.id) {
          await this.syncService.deleteComment(payload.comment.id);
          // 评论计数随之变化，重同步宿主 issue
          if (payload.issue?.number) {
            await this.syncService.syncIssue(payload.issue.number);
          }
          this.logger.log(`Deleted comment #${payload.comment.id} synced`);
        } else if (payload.issue?.id) {
          await this.syncService.deleteIssue(payload.issue.id);
          this.logger.log(`Deleted issue #${payload.issue.number} synced`);
        }
        return { success: true };
      }

      if (payload.action === 'opened' || payload.action === 'edited' || payload.action === 'closed' || payload.action === 'reopened') {
        // Issue event（reopened 也全量同步：state 回 open 需入库）
        await this.syncService.syncIssue(issue.number);
        this.logger.log(`Synced issue #${issue.number} (${action})`);

        if (action === 'closed') {
          await this.dispatchArchive(issue.number);
        }
      } else if (payload.action === 'created' || payload.action === 'edited') {
        // Comment event
        await this.syncService.syncComment(comment.id, issue.number);
        await this.syncService.syncIssue(issue.number); // Update comment count
        this.logger.log(`Synced comment #${comment.id} (${action})`);
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  private async dispatchArchive(issueNumber: number): Promise<void> {
    const repo = this.configService.get<string>('SHADOW_PROJECT_REPO', 'stack-wuh/x.wuh.site')
    const workflowRepo = this.configService.get<string>('SHADOW_WORKFLOW_REPO', 'stack-wuh/shadow-dev-workflow')

    try {
      const token = this.configService.get<string>('GH_TOKEN') || this.configService.get<string>('GITHUB_TOKEN')
      if (!token) {
        this.logger.warn('No GH_TOKEN configured, skipping archive dispatch')
        return
      }

      const res = await fetch(
        `https://api.github.com/repos/${workflowRepo}/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: buildDispatchBody(issueNumber, repo),
        },
      )
      // 401/422 等失败不再静默记成功（P2：dispatchArchive 不检查响应状态）
      if (!res.ok) {
        throw new Error(`dispatch API responded ${res.status}: ${await res.text().catch(() => '')}`)
      }

      this.logger.log(`Dispatched archive for issue #${issueNumber} → ${repo}`)
    } catch (error) {
      this.logger.error(`Failed to dispatch archive for issue #${issueNumber}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }


  @Post('sync/:issueNumber')
  @ApiOperation({ summary: 'Direct sync a single issue (root only; the public GitHub webhook is the unattended path)' })
  @UseGuards(JwtAuthGuard, RootGuard)
  async syncIssueDirectly(@Param('issueNumber') issueNumber: string) {
    const num = parseInt(issueNumber, 10)
    if (!Number.isInteger(num) || num <= 0) {
      throw new BadRequestException('issueNumber must be a positive integer')
    }
    await this.syncService.syncIssue(num)
    this.logger.log(`Direct sync completed for issue #${num}`)
    return { success: true, issueNumber: num }
  }
}
