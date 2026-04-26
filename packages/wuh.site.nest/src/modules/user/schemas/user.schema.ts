import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ROOT = 'root',
  WRITER = 'writer',
  READER = 'reader',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  githubId: number;

  @Prop({ required: true })
  login: string;

  @Prop()
  email?: string;

  @Prop()
  avatarUrl?: string;

  @Prop()
  profileUrl?: string;

  @Prop({ enum: UserRole, default: UserRole.READER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ githubId: 1 }, { unique: true });
UserSchema.index({ login: 1 });
