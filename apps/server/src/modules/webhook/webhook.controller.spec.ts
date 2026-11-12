import { WebhookController } from './webhook.controller';
import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';

// webhook 控制器经 sync.service 间接加载 @octokit/rest（ESM-only 包，ts-jest 不转
// node_modules）——本 spec 不测 octokit 面，mock 断开加载链
jest.mock('@octokit/rest', () => ({ Octokit: jest.fn().mockImplementation(() => ({ issues: {} })) }));

/** 构造带 rawBody 的伪 request（批次 3 起签名对原始字节校验） */
function makeRequest(headers: Record<string, string>, rawBody?: Buffer) {
  return { headers, rawBody, ip: '127.0.0.1' } as any;
}

function makeController(secret: string | undefined) {
  const syncService = {
    syncIssue: jest.fn().mockResolvedValue(undefined),
    syncComment: jest.fn().mockResolvedValue(undefined),
    deleteIssue: jest.fn().mockResolvedValue(undefined),
    deleteComment: jest.fn().mockResolvedValue(undefined),
  };
  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'GITHUB_WEBHOOK_SECRET') return secret;
      if (key === 'GH_TOKEN' || key === 'GITHUB_TOKEN') return undefined;
      return undefined;
    }),
  };
  const controller = new WebhookController(syncService as any, configService as any);
  return { controller, syncService };
}

function sign(secret: string, body: Buffer): string {
  // 与控制器同口径的 HMAC（测试用 crypto 直算）
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  return `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`;
}

const SECRET = 'test-secret';
const PAYLOAD = { action: 'opened', issue: { id: 1, number: 10, title: 't' } };
const RAW = Buffer.from(JSON.stringify(PAYLOAD));

describe('WebhookController handleGitHubWebhook (审计 #568 批次 3/4 行为契约)', () => {
  it('rejects with 503 when the webhook secret is not configured (fail-fast)', async () => {
    const { controller } = makeController(undefined);
    await expect(
      controller.handleGitHubWebhook(makeRequest({}, RAW), PAYLOAD),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('accepts a valid signature over the raw body and syncs the issue', async () => {
    const { controller, syncService } = makeController(SECRET);
    const req = makeRequest(
      { 'x-hub-signature-256': sign(SECRET, RAW), 'x-github-delivery': 'd1' },
      RAW,
    );
    const res = await controller.handleGitHubWebhook(req, PAYLOAD);
    expect(res).toEqual({ success: true });
    expect(syncService.syncIssue).toHaveBeenCalledWith(10);
  });

  it('rejects a signature computed over re-serialized JSON (raw-body contract)', async () => {
    const { controller, syncService } = makeController(SECRET);
    // 攻击面：对 re-serialize 的 JSON 签名与对原始字节签名不同——拒绝
    const wrongSig = sign(SECRET, Buffer.from(JSON.stringify(PAYLOAD, null, 2)));
    const req = makeRequest(
      { 'x-hub-signature-256': wrongSig, 'x-github-delivery': 'd2' },
      RAW,
    );
    await expect(controller.handleGitHubWebhook(req, PAYLOAD)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(syncService.syncIssue).not.toHaveBeenCalled();
  });

  it('rejects when rawBody is missing (middleware verify chain broken)', async () => {
    const { controller } = makeController(SECRET);
    const req = makeRequest({ 'x-hub-signature-256': sign(SECRET, RAW) });
    await expect(controller.handleGitHubWebhook(req, PAYLOAD)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('dedupes the same delivery id within the window', async () => {
    const { controller, syncService } = makeController(SECRET);
    const headers = { 'x-hub-signature-256': sign(SECRET, RAW), 'x-github-delivery': 'dup-1' };
    await controller.handleGitHubWebhook(makeRequest(headers, RAW), PAYLOAD);
    const res = await controller.handleGitHubWebhook(makeRequest(headers, RAW), PAYLOAD);
    expect(res).toEqual({ success: true, deduped: true });
    expect(syncService.syncIssue).toHaveBeenCalledTimes(1);
  });

  it('deletes the local comment and re-syncs the host issue on comment deleted', async () => {
    const { controller, syncService } = makeController(SECRET);
    const payload = { action: 'deleted', comment: { id: 55 }, issue: { number: 10 } };
    const req = makeRequest(
      { 'x-hub-signature-256': sign(SECRET, Buffer.from(JSON.stringify(payload))), 'x-github-delivery': 'd3' },
      Buffer.from(JSON.stringify(payload)),
    );
    await controller.handleGitHubWebhook(req, payload);
    expect(syncService.deleteComment).toHaveBeenCalledWith(55);
    expect(syncService.syncIssue).toHaveBeenCalledWith(10);
  });

  it('deletes the local issue on issue deleted', async () => {
    const { controller, syncService } = makeController(SECRET);
    const payload = { action: 'deleted', issue: { id: 99, number: 10 } };
    const req = makeRequest(
      { 'x-hub-signature-256': sign(SECRET, Buffer.from(JSON.stringify(payload))), 'x-github-delivery': 'd4' },
      Buffer.from(JSON.stringify(payload)),
    );
    await controller.handleGitHubWebhook(req, payload);
    expect(syncService.deleteIssue).toHaveBeenCalledWith(99);
    expect(syncService.syncIssue).not.toHaveBeenCalled();
  });

  it('syncs reopened issues back into the local store', async () => {
    const { controller, syncService } = makeController(SECRET);
    const payload = { action: 'reopened', issue: { id: 1, number: 10 } };
    const req = makeRequest(
      { 'x-hub-signature-256': sign(SECRET, Buffer.from(JSON.stringify(payload))), 'x-github-delivery': 'd5' },
      Buffer.from(JSON.stringify(payload)),
    );
    await controller.handleGitHubWebhook(req, payload);
    expect(syncService.syncIssue).toHaveBeenCalledWith(10);
  });
});
