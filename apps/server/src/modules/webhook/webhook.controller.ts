import {
  Controller,
  Post,
  Param,
  Body,
  Req,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { SyncService } from '../sync/sync.service';

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
  private webhookSecret: string;

  constructor(
    private syncService: SyncService,
    private configService: ConfigService,
  ) {
    this.webhookSecret = this.configService.get<string>('GITHUB_WEBHOOK_SECRET');
  }

  @Post('github')
  @ApiOperation({ summary: 'Handle GitHub webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  @ApiResponse({ status: 400, description: 'Invalid signature' })
  async handleGitHubWebhook(@Req() request: Request, @Body() payload: any) {
    // Verify GitHub signature
    const signature = request.headers['x-hub-signature-256'] as string;
    if (!this.verifySignature(signature, JSON.stringify(payload))) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const { action, issue, comment } = payload;

    try {
      if (payload.action === 'opened' || payload.action === 'edited' || payload.action === 'closed') {
        // Issue event
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
      this.logger.error(`Webhook processing failed: ${error.message}`);
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

      await fetch(
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

      this.logger.log(`Dispatched archive for issue #${issueNumber} → ${repo}`)
    } catch (error) {
      this.logger.error(`Failed to dispatch archive for issue #${issueNumber}: ${error.message}`)
    }
  }

  private verifySignature(signature: string, payload: string): boolean {
    const hash = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');
    return signature === `sha256=${hash}`;
  }

  @Post('sync/:issueNumber')
  @ApiOperation({ summary: 'Direct sync a single issue (no webhook required)' })
  async syncIssueDirectly(@Param('issueNumber') issueNumber: string) {
    const num = parseInt(issueNumber, 10)
    await this.syncService.syncIssue(num)
    this.logger.log(`Direct sync completed for issue #${num}`)
    return { success: true, issueNumber: num }
  }
}
