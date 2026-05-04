import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RepoDto {
  @ApiProperty({ description: 'Repository name' })
  name: string;

  @ApiPropertyOptional({ description: 'Repository description' })
  description: string | null;

  @ApiProperty({ description: 'GitHub URL' })
  html_url: string;

  @ApiProperty({ description: 'Star count' })
  stargazers_count: number;

  @ApiPropertyOptional({ description: 'Primary language' })
  language: string | null;

  @ApiPropertyOptional({ description: 'Homepage URL' })
  homepage: string | null;

  @ApiProperty({ description: 'Whether repo is a fork' })
  fork: boolean;
}

export class ReposResponseDto {
  @ApiProperty({ description: 'List of repositories', type: [RepoDto] })
  repos: RepoDto[];
}
