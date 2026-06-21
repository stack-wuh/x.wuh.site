import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GitHubProfileDto {
  @ApiProperty({ description: 'GitHub username' })
  login: string;

  @ApiProperty({ description: 'Display name' })
  name: string;

  @ApiProperty({ description: 'Avatar URL' })
  avatar_url: string;

  @ApiPropertyOptional({ description: 'GitHub bio' })
  bio: string | null;

  @ApiPropertyOptional({ description: 'Blog URL' })
  blog: string | null;

  @ApiPropertyOptional({ description: 'Location' })
  location: string | null;

  @ApiProperty({ description: 'Public repo count' })
  public_repos: number;

  @ApiProperty({ description: 'Follower count' })
  followers: number;

  @ApiProperty({ description: 'Following count' })
  following: number;

  @ApiProperty({ description: 'Account creation date (ISO string)' })
  created_at: string;
}

export class GitHubProfileResponseDto {
  @ApiProperty({ description: 'GitHub profile', type: GitHubProfileDto })
  profile: GitHubProfileDto;
}
