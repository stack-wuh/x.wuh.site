import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReposService } from './repos.service';
import { ReposResponseDto } from './dto/repos.dto';
import { GitHubProfileResponseDto } from './dto/profile.dto';

@ApiTags('Repos')
@Controller('repos')
export class ReposController {
  constructor(private readonly reposService: ReposService) {}

  @Get()
  @ApiOperation({ summary: 'Get GitHub repositories' })
  @ApiResponse({
    status: 200,
    description: 'List of pinned repositories from GitHub',
    type: ReposResponseDto,
  })
  async getRepos(): Promise<ReposResponseDto> {
    const repos = await this.reposService.getRepos();
    return { repos };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get GitHub user profile' })
  @ApiResponse({
    status: 200,
    description: 'GitHub user profile data',
    type: GitHubProfileResponseDto,
  })
  async getUserProfile(): Promise<GitHubProfileResponseDto> {
    const profile = await this.reposService.getUserProfile();
    return { profile };
  }
}
