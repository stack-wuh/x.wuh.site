import { ContentController } from './content.controller';

describe('ContentController likePost', () => {
  it('returns open label summaries from the content service', async () => {
    const contentService = {
      getLabelSummaries: jest.fn().mockResolvedValue([
        { name: 'frontend', count: 3 },
        { name: 'nextjs', count: 2 },
      ]),
    };
    const controller = new ContentController(contentService as any);

    const result = await controller.getLabels({ state: 'open' } as any);

    expect(result).toEqual([
      { name: 'frontend', count: 3 },
      { name: 'nextjs', count: 2 },
    ]);
    expect(contentService.getLabelSummaries).toHaveBeenCalledWith({ state: 'open' });
  });

  it('toggles like state by anonymous cookie id', async () => {
    const contentService = {
      hasLiked: jest.fn().mockResolvedValue(false),
      incrementLikeCount: jest.fn().mockResolvedValue(undefined),
      decrementLikeCount: jest.fn().mockResolvedValue(undefined),
    };
    const controller = new ContentController(contentService as any);
    const req = {
      cookies: { anonId: 'anon-123' },
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    } as any;
    const res = {
      cookie: jest.fn(),
    } as any;

    const liked = await controller.likePost('155', req, res);

    expect(liked).toEqual({ liked: true, message: 'Liked' });
    expect(contentService.hasLiked).toHaveBeenCalledWith(155, 'anon-123');
    expect(contentService.incrementLikeCount).toHaveBeenCalledWith(155, 'anon-123');
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('issues an anonymous cookie when toggling like without one', async () => {
    const contentService = {
      hasLiked: jest.fn().mockResolvedValue(false),
      incrementLikeCount: jest.fn().mockResolvedValue(undefined),
      decrementLikeCount: jest.fn().mockResolvedValue(undefined),
    };
    const controller = new ContentController(contentService as any);
    const req = {
      cookies: {},
      headers: {},
    } as any;
    const res = {
      cookie: jest.fn(),
    } as any;

    await controller.likePost('155', req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      'anonId',
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        path: '/',
      }),
    );
    expect(contentService.incrementLikeCount).toHaveBeenCalledWith(155, expect.any(String));
  });

  it('returns liked state from post detail with anonymous cookie id', async () => {
    const contentService = {
      findBySlugOrNumber: jest.fn().mockResolvedValue({
        number: 155,
        toJSON: () => ({
          number: 155,
          title: 'Post',
          body: '',
          labels: [],
          state: 'open',
          comments: 0,
          viewCount: 0,
          likeCount: 1,
          createdAtGitHub: new Date(),
          updatedAtGitHub: new Date(),
        }),
      }),
      incrementViewCount: jest.fn().mockResolvedValue(undefined),
      findAdjacentPosts: jest.fn().mockResolvedValue({ prev: null, next: null, total: 1, position: 1 }),
      hasLiked: jest.fn().mockResolvedValue(true),
    };
    const controller = new ContentController(contentService as any);
    const req = {
      cookies: { anonId: 'anon-123' },
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    } as any;
    const res = {
      cookie: jest.fn(),
    } as any;

    const result = await controller.getPostDetail('155', req, res);

    expect(result.liked).toBe(true);
    expect(contentService.hasLiked).toHaveBeenCalledWith(155, 'anon-123');
    expect(res.cookie).not.toHaveBeenCalled();
  });
});
