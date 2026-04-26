import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateAnonymousCommentDto {
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

export class QueryCommentDto {
  @IsOptional()
  issueNumber?: number;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;
}
