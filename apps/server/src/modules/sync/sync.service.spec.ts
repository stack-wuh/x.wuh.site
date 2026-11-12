import { SyncService } from './sync.service';

// 工厂必须自包含（hoisting 后外层变量不可见）；不 import Octokit——显式类型/值
// import 会让 ts-jest diagnostics 解析 @octokit/rest 巨型类型树直至 OOM（gate 首跑实测）
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    issues: {
      listForRepo: jest.fn(),
      get: jest.fn(),
      listComments: jest.fn(),
      getComment: jest.fn(),
    },
  })),
}));

function makeService() {
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
  const service = new SyncService(configService as any, contentService as any, commentService as any);
  // octokit 实例经 service 拿（constructor 里 new 被上面工厂 mock）
  const octokit = (service as unknown as { octokit: { issues: Record<string, jest.Mock> } }).octokit;
  octokit.issues.listComments.mockResolvedValue({ data: [] });
  return { service, contentService, commentService, octokit };
}

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

describe('SyncService fullSync reconciliation (审计 #568 批次 4 行为契约)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters PR entries out of the listing (pull_request key)', async () => {
    const { service, contentService, octokit } = makeService();
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
    const { service, contentService, octokit } = makeService();
    octokit.issues.listForRepo.mockResolvedValue({ data: [issueFixture(1, 101)] });
    octokit.issues.get.mockResolvedValue({ data: issueFixture(1, 101) });

    await service.fullSync();

    expect(contentService.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ publishedAt: new Date('2026-01-01T00:00:00Z') }),
    );
  });

  it('reconciles locally-orphaned issues against the remote number set', async () => {
    const { service, contentService, octokit } = makeService();
    octokit.issues.listForRepo.mockResolvedValue({ data: [issueFixture(1, 101)] });
    octokit.issues.get.mockResolvedValue({ data: issueFixture(1, 101) });

    await service.fullSync();

    // 远端全集 [1] → 本地不在集合内的记录应被对账删除
    expect(contentService.deleteAllNotIn).toHaveBeenCalledWith([1]);
  });

  it('skips reconciliation when the remote returns nothing (empty-set guard)', async () => {
    const { service, contentService, octokit } = makeService();
    octokit.issues.listForRepo.mockResolvedValue({ data: [] });

    await service.fullSync();

    // 空全集不触发删除（防止拉取异常拿到残缺集合误删全库）
    expect(contentService.deleteAllNotIn).not.toHaveBeenCalled();
  });
});
