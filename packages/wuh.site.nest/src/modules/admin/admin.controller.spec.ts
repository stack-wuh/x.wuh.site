jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn(),
}));

import { NotFoundException } from '@nestjs/common';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
  const createController = () => {
    const contentService = {
      findAll: jest.fn().mockResolvedValue({ data: [], pagination: { page: 1, limit: 20, total: 0 } }),
      findByNumber: jest.fn().mockResolvedValue({ number: 155, title: 'Post' }),
      updateMetadata: jest.fn().mockResolvedValue({ number: 155, metadata: { summary: 'Updated' } }),
    };
    const commentService = {
      findAll: jest.fn().mockResolvedValue({ data: [], pagination: { page: 1, limit: 20, total: 0 } }),
      updateStatus: jest.fn().mockResolvedValue({ _id: 'c1', status: 'rejected' }),
      delete: jest.fn().mockResolvedValue({ _id: 'c1' }),
      approveAndPostToGitHub: jest.fn().mockResolvedValue({ _id: 'c1', status: 'approved' }),
    };
    const userService = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const controller = new AdminController(contentService as any, commentService as any, userService as any);
    return { controller, contentService, commentService, userService };
  };


  it('lists users with stack-wuh as root and downgrades every other stored role to reader', async () => {
    const { controller, userService } = createController();
    userService.findAll.mockResolvedValue([
      { githubId: 1, login: 'stack-wuh', role: 'reader', lastLoginAt: new Date('2026-07-19T00:00:00Z') },
      { githubId: 2, login: 'guest', role: 'root', lastLoginAt: new Date('2026-07-19T00:00:00Z') },
    ]);

    const result = await controller.getUsers();

    expect(result).toEqual([
      expect.objectContaining({ login: 'stack-wuh', role: 'root', permissions: expect.arrayContaining(['admin:write']) }),
      expect.objectContaining({ login: 'guest', role: 'reader', permissions: ['admin:read', 'content:read', 'guestbook:read', 'comment:read'] }),
    ]);
  });

  it('lists admin posts with filters through content service', async () => {
    const { controller, contentService } = createController();

    await controller.getPosts({ page: 2, limit: 10, state: 'open', labels: ['react'] } as any);

    expect(contentService.findAll).toHaveBeenCalledWith(2, 10, {
      state: 'open',
      labels: { $all: ['react'] },
    });
  });

  it('returns admin post detail by number', async () => {
    const { controller, contentService } = createController();

    const result = await controller.getPost('155');

    expect(result).toEqual({ number: 155, title: 'Post' });
    expect(contentService.findByNumber).toHaveBeenCalledWith(155);
  });

  it('throws 404 when admin post detail is missing', async () => {
    const { controller, contentService } = createController();
    contentService.findByNumber.mockResolvedValue(null);

    await expect(controller.getPost('404')).rejects.toThrow(NotFoundException);
  });

  it('lists guestbook comments by guestbook repo', async () => {
    const { controller, commentService } = createController();

    await controller.getGuestbookComments({ page: 1, limit: 20 } as any);

    expect(commentService.findAll).toHaveBeenCalledWith(1, 20, { repo: 'guestbook' });
  });

  it('lists pending post comments by status', async () => {
    const { controller, commentService } = createController();

    await controller.getPostComments({ page: 1, limit: 20, status: 'pending', issueNumber: 155 } as any);

    expect(commentService.findAll).toHaveBeenCalledWith(1, 20, {
      repo: 'blog',
      status: 'pending',
      issueNumber: 155,
    });
  });

  it('approves post comments through comment service', async () => {
    const { controller, commentService } = createController();

    const result = await controller.approvePostComment('c1');

    expect(result).toEqual({ _id: 'c1', status: 'approved' });
    expect(commentService.approveAndPostToGitHub).toHaveBeenCalledWith('c1');
  });
});
