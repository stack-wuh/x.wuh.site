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

/* ── SyncService fullSync 对账契约（批次 4 行为面，与上同链路故同文件承载——
   独立 spec 文件在 jest mock hoisting × ts-jest isolatedModules 交互下有 OOM 玄学，
   gate 五轮实证 webhook 文件环境稳定，见 20261112 批次 5 brief） ── */

function issueFixture(number: number, id: number) {
  return {
    number,
    id,
    title: `issue ${number}`,
    state: 'open',
    body: 'body',
    labels: [],
    comments: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
    user: { login: 'u', avatar_url: '', html_url: '' },
  };
}

function makeSyncService() {
  const contentService = {
    upsert: jest.fn().mockResolvedValue({}),
    deleteByExternalId: jest.fn().mockResolvedValue(undefined),
    deleteAllNotIn: jest.fn().mockResolvedValue({ deletedCount: 2 }),
  };
  const commentService = {
    upsert: jest.fn().mockResolvedValue({}),
    deleteByExternalId: jest.fn().mockResolvedValue(undefined),
  };
  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'GITHUB_PERSONAL_TOKEN') return 'tok';
      if (key === 'CONTENT_REPO_OWNER') return 'stack-wuh';
      if (key === 'CONTENT_REPO_NAME') return 'x.wuh.site';
      return undefined;
    }),
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SyncService } = require('../sync/sync.service');
  const service = new SyncService(configService, contentService, commentService);
  // 构造后直接替换实例 octokit（ts-jest 无 babel hoisting，jest.mock 不早于真实包
  // 加载——构造期注入不可行，替换实例字段与构建机制解耦）
  const octokit = {
    issues: {
      listForRepo: jest.fn(),
      get: jest.fn(),
      listComments: jest.fn(),
      getComment: jest.fn(),
    },
  };
  (service as unknown as { octokit: unknown }).octokit = octokit;
  // syncIssue 内部会拉评论列表；测试不关心评论面，统一空集
  octokit.issues.listComments.mockResolvedValue({ data: [] });
  return { service, contentService, octokit };
}

describe('SyncService fullSync reconciliation (审计 #568 批次 4 行为契约)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters PR entries out of the listing (pull_request key)', async () => {
    const { service, contentService, octokit } = makeSyncService();
    octokit.issues.listForRepo.mockResolvedValue({
      data: [issueFixture(1, 101), { ...issueFixture(2, 102), pull_request: { url: 'x' } }],
    });
    octokit.issues.get.mockImplementation(({ issue_number }: any) =>
      Promise.resolve({ data: issueFixture(issue_number, 1000 + issue_number) }),
    );

    await service.fullSync();

    const syncedNumbers = octokit.issues.get.mock.calls.map((c: any[]) => c[0].issue_number);
    expect(syncedNumbers).toContain(1);
    expect(syncedNumbers).not.toContain(2);
    expect(contentService.upsert).toHaveBeenCalledTimes(1);
  });

  it('writes publishedAt from the issue creation date', async () => {
    const { service, contentService, octokit } = makeSyncService();
    octokit.issues.listForRepo.mockResolvedValue({ data: [issueFixture(1, 101)] });
    octokit.issues.get.mockResolvedValue({ data: issueFixture(1, 101) });

    await service.fullSync();

    expect(contentService.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ publishedAt: new Date('2026-01-01T00:00:00Z') }),
    );
  });

  it('reconciles locally-orphaned issues against the remote number set', async () => {
    const { service, contentService, octokit } = makeSyncService();
    octokit.issues.listForRepo.mockResolvedValue({ data: [issueFixture(1, 101)] });
    octokit.issues.get.mockResolvedValue({ data: issueFixture(1, 101) });

    await service.fullSync();

    // 远端全集 [1] → 本地不在集合内的记录应被对账删除
    expect(contentService.deleteAllNotIn).toHaveBeenCalledWith([1]);
  });

  it('skips reconciliation when the remote returns nothing (empty-set guard)', async () => {
    const { service, contentService, octokit } = makeSyncService();
    octokit.issues.listForRepo.mockResolvedValue({ data: [] });

    await service.fullSync();

    // 空全集不触发删除（防止拉取异常拿到残缺集合误删全库）
    expect(contentService.deleteAllNotIn).not.toHaveBeenCalled();
  });
});
