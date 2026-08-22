import { UserRole } from './schemas/user.schema';
import { UserService } from './user.service';

describe('UserService admin role resolution', () => {
  const createService = () => new UserService({} as any);

  it('resolves stack-wuh as the only root user', () => {
    const service = createService();

    expect(service.resolveRoleByLogin('stack-wuh')).toBe(UserRole.ROOT);
    expect(service.resolveRoleByLogin('Stack-Wuh')).toBe(UserRole.READER);
    expect(service.resolveRoleByLogin('another-user')).toBe(UserRole.READER);
  });

  it('forces non-root GitHub users to reader during upsert even when a root role is supplied', async () => {
    const exec = jest.fn().mockResolvedValue({
      githubId: 42,
      login: 'guest',
      role: UserRole.READER,
    });
    const findOneAndUpdate = jest.fn().mockReturnValue({ exec });
    const userModel = Object.assign(jest.fn(), { findOneAndUpdate });
    const service = new UserService(userModel as any);

    await service.upsertGithubUser({
      githubId: 42,
      login: 'guest',
      avatarUrl: 'https://example.com/avatar.png',
      profileUrl: 'https://github.com/guest',
      role: UserRole.ROOT,
    });

    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { githubId: 42 },
      expect.objectContaining({ role: UserRole.READER, lastLoginAt: expect.any(Date) }),
      expect.objectContaining({ upsert: true, new: true }),
    );
  });
});
