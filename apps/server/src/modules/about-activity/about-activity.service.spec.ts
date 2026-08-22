jest.mock('../api-v2/github/github.service', () => ({
  GithubService: class GithubService {},
}));
jest.mock('../content/schemas/content.schema', () => ({
  Content: class Content {},
}));
jest.mock('../comment/schemas/comment.schema', () => ({
  Comment: class Comment {},
}));

import { AboutActivityService } from './about-activity.service';

describe('AboutActivityService getActivity', () => {
  it('returns 365 days and merges GitHub counts into the unified total', async () => {
    const visits = new Map([['2026-07-27', 2]]);
    const contentModel = {
      aggregate: jest
        .fn()
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue([{ _id: '2026-07-27', count: 3 }]) })
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue([{ _id: '2026-07-27', count: 4 }]) }),
    };
    const commentModel = {
      aggregate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          { _id: { date: '2026-07-27', guestbook: false }, count: 5 },
          { _id: { date: '2026-07-27', guestbook: true }, count: 6 },
        ]),
      }),
    };
    const service = new AboutActivityService(
      { getDailyCounts: jest.fn().mockResolvedValue(visits) } as any,
      { getContributions: jest.fn().mockResolvedValue({ weeks: [{ days: [{ date: '2026-07-27', count: 7, level: 1 }] }] }) } as any,
      contentModel as any,
      commentModel as any,
    );

    const result = await service.getActivity();
    const day = result.days.find((item) => item.date === '2026-07-27');

    expect(result.days).toHaveLength(365);
    expect(day).toEqual(expect.objectContaining({ total: 27 }));
    expect(day?.counts).toEqual({
      visits: 2,
      published: 3,
      updated: 4,
      comments: 5,
      guestbook: 6,
      projectUpdates: 0,
      githubContributions: 7,
    });
    expect(result.total).toBe(27);
  });

  it('propagates GitHub contribution failures instead of returning fake zero data', async () => {
    const failure = new Error('GitHub unavailable');
    const service = new AboutActivityService(
      { getDailyCounts: jest.fn().mockResolvedValue(new Map()) } as any,
      { getContributions: jest.fn().mockRejectedValue(failure) } as any,
      { aggregate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }) } as any,
      { aggregate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }) } as any,
    );

    await expect(service.getActivity()).rejects.toBe(failure);
  });
});
