import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ROOT = 'root',
  WRITER = 'writer',
  READER = 'reader',
}

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'GitHub user id' })
  @Prop({ required: true, unique: true })
  githubId: number;

  @ApiProperty({ description: 'GitHub login name' })
  @Prop({ required: true })
  login: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @Prop()
  email?: string;

  @ApiPropertyOptional({ description: 'Avatar URL' })
  @Prop()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'GitHub profile URL' })
  @Prop()
  profileUrl?: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Prop({ enum: UserRole, default: UserRole.READER })
  role: UserRole;

  @ApiProperty({ description: 'Whether user is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Last login time' })
  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ githubId: 1 }, { unique: true });
UserSchema.index({ login: 1 });
