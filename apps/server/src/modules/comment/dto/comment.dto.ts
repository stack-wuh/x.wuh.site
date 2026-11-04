import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateAnonymousCommentDto as ICreateAnonymousCommentDto, QueryCommentDto as IQueryCommentDto } from '@wuh.site/core';

export class CreateAnonymousCommentDto implements ICreateAnonymousCommentDto {
  @ApiProperty({ description: 'Display nickname', minLength: 2, maxLength: 50 })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  nickname: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Comment content', minLength: 5, maxLength: 2000 })
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional({ description: 'Anonymous visitor footprint' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  footprint?: string;

  @ApiPropertyOptional({ description: 'Page identifier (e.g. about-guestbook)' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  page?: string;

  @ApiPropertyOptional({ description: 'GitHub issue number (blog post)' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  issueNumber?: number;
}

export class QueryCommentDto implements IQueryCommentDto {
  @ApiPropertyOptional({ description: 'Filter by issue number' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  issueNumber?: number;

  @ApiPropertyOptional({ description: 'Filter by moderation status', enum: ['pending', 'approved', 'rejected'] })
  @IsIn(['pending', 'approved', 'rejected'])
  @IsOptional()
  status?: 'pending' | 'approved' | 'rejected';

  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number = 20;
}
