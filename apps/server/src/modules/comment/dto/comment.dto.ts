import { IsString, IsEmail, IsOptional, MinLength, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateAnonymousCommentDto as ICreateAnonymousCommentDto, QueryCommentDto as IQueryCommentDto } from '@wuh.site/core';

export class CreateAnonymousCommentDto implements ICreateAnonymousCommentDto {
  @ApiProperty({ description: 'Display nickname', minLength: 2 })
  @IsString()
  @MinLength(2)
  nickname: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Comment content', minLength: 5 })
  @IsString()
  @MinLength(5)
  content: string;

  @ApiPropertyOptional({ description: 'Anonymous visitor footprint' })
  @IsString()
  @IsOptional()
  footprint?: string;

  @ApiPropertyOptional({ description: 'Page identifier (e.g. about-guestbook)' })
  @IsString()
  @IsOptional()
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
