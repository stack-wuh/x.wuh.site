import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import type { CreateAnonymousCommentDto as ICreateAnonymousCommentDto, QueryCommentDto as IQueryCommentDto } from '@wuh.site/shared-contracts';

export class CreateAnonymousCommentDto implements ICreateAnonymousCommentDto {
  @IsString()
  @MinLength(2)
  nickname: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(5)
  content: string;
}

export class QueryCommentDto implements IQueryCommentDto {
  @IsOptional()
  issueNumber?: number;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;
}
