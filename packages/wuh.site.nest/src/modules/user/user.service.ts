import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByGithubId(githubId: number): Promise<UserDocument | null> {
    return this.userModel.findOne({ githubId }).exec();
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login }).exec();
  }

  async createOrUpdate(userData: Partial<User>): Promise<UserDocument> {
    const existing = await this.findByGithubId(userData.githubId);

    if (existing) {
      return this.userModel
        .findByIdAndUpdate(existing._id, userData, { new: true })
        .exec();
    }

    const user = new this.userModel(userData);
    return await user.save();
  }

  async updateRole(githubId: number, role: UserRole): Promise<UserDocument> {
    return this.userModel
      .findOneAndUpdate({ githubId }, { role }, { new: true })
      .exec();
  }

  async isRootUser(githubId: number): Promise<boolean> {
    const rootIds = process.env.ROOT_GITHUB_IDS?.split(',').map(Number) || [];
    return rootIds.includes(githubId);
  }
}
