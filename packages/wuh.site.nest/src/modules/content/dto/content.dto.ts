import { IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';

export class CreateContentDto {
  @IsNumber()
  externalId: number;

  @IsString()
  repo: string;

  @IsNumber()
  number: number;

  @IsString()
  title: string;

  @IsArray()
  @IsOptional()
  labels?: string[];

  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  bodyHtml?: string;

  @IsOptional()
  metadata?: {
    slug?: string;
    summary?: string;
    cover?: string;
    keywords?: string[];
    rssExcluded?: boolean;
    extra?: Record<string, unknown>;
  };
}

export class UpdateContentMetadataDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsArray()
  @IsOptional()
  keywords?: string[];

  @IsOptional()
  rssExcluded?: boolean;

  @IsOptional()
  extra?: Record<string, unknown>;
}

export class QueryContentDto {
  @IsArray()
  @IsOptional()
  labels?: string[];

  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 20;

  @IsEnum(['open', 'closed'])
  @IsOptional()
  state?: 'open' | 'closed';
}
