import { IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateContentDto as ICreateContentDto, UpdateContentMetadataDto as IUpdateContentMetadataDto, QueryContentDto as IQueryContentDto } from '@wuh.site/core';

export class CreateContentDto implements ICreateContentDto {
  @ApiProperty({ description: 'GitHub issue id' })
  @IsNumber()
  externalId: number;

  @ApiProperty({ description: 'Repository name' })
  @IsString()
  repo: string;

  @ApiProperty({ description: 'Issue number' })
  @IsNumber()
  number: number;

  @ApiProperty({ description: 'Issue title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Issue labels', type: [String] })
  @IsArray()
  @IsOptional()
  labels?: string[];

  @ApiPropertyOptional({ description: 'Issue body (markdown)' })
  @IsString()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional({ description: 'Issue body (HTML)' })
  @IsString()
  @IsOptional()
  bodyHtml?: string;

  @ApiPropertyOptional({ description: 'Content metadata' })
  @IsOptional()
  metadata?: {
    slug?: string;
    summary?: string;
    cover?: string;
    coverAlt?: string;
    keywords?: string[];
    rssExcluded?: boolean;
    extra?: Record<string, unknown>;
  };
}

export class UpdateContentMetadataDto implements IUpdateContentMetadataDto {
  @ApiPropertyOptional({ description: 'Content slug' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: 'Content summary' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiPropertyOptional({ description: 'Cover image alternative text' })
  @IsString()
  @IsOptional()
  coverAlt?: string;

  @ApiPropertyOptional({ description: 'Keywords', type: [String] })
  @IsArray()
  @IsOptional()
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Exclude from RSS' })
  @IsOptional()
  rssExcluded?: boolean;

  @ApiPropertyOptional({ description: 'Extra data' })
  @IsOptional()
  extra?: Record<string, unknown>;
}

export class QueryContentDto implements IQueryContentDto {
  @ApiPropertyOptional({
    description: 'Filter by labels (comma-separated or array)',
    type: [String],
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
    return value;
  })
  @IsArray()
  @IsOptional()
  labels?: string[];

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

  @ApiPropertyOptional({ description: 'Issue state', enum: ['open', 'closed'] })
  @IsEnum(['open', 'closed'])
  @IsOptional()
  state?: 'open' | 'closed';
}
