import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';

export const ROOT_GITHUB_LOGIN = 'stack-wuh';

export interface GithubUserInput {
  githubId: number;
  login: string;
  email?: string;
  avatarUrl?: string;
  profileUrl?: string;
  role?: UserRole;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  resolveRoleByLogin(login: string): UserRole.ROOT | UserRole.READER {
    return login === ROOT_GITHUB_LOGIN ? UserRole.ROOT : UserRole.READER;
  }

  async findByGithubId(githubId: number): Promise<UserDocument | null> {
    return this.userModel.findOne({ githubId }).exec();
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel
      .find({})
      .sort({ lastLoginAt: -1, login: 1 })
      .exec();
  }

  async createOrUpdate(userData: Partial<User>): Promise<UserDocument> {
    const existing = await this.findByGithubId(userData.githubId);
    const sanitized = {
      ...userData,
      role: userData.login ? this.resolveRoleByLogin(userData.login) : UserRole.READER,
    };

    if (existing) {
      return this.userModel
        .findByIdAndUpdate(existing._id, sanitized, { new: true })
        .exec();
    }

    const user = new this.userModel(sanitized);
    return await user.save();
  }

  async upsertGithubUser(userData: GithubUserInput): Promise<UserDocument> {
    const sanitized = {
      ...userData,
      role: this.resolveRoleByLogin(userData.login),
      lastLoginAt: new Date(),
    };

    return this.userModel
      .findOneAndUpdate(
        { githubId: userData.githubId },
        sanitized,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();
  }

  async updateRole(githubId: number, _role: UserRole): Promise<UserDocument> {
    const user = await this.findByGithubId(githubId);
    const resolvedRole = user ? this.resolveRoleByLogin(user.login) : UserRole.READER;

    return this.userModel
      .findOneAndUpdate({ githubId }, { role: resolvedRole }, { new: true })
      .exec();
  }

  async isRootUser(githubId: number): Promise<boolean> {
    const user = await this.findByGithubId(githubId);
    return user?.login === ROOT_GITHUB_LOGIN;
  }
}
