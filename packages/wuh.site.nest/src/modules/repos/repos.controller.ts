import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReposService } from './repos.service';
import { ReposResponseDto } from './dto/repos.dto';

@ApiTags('Repos')
@Controller('repos')
export class ReposController {
  constructor(private readonly reposService: ReposService) {}

  @Get()
  @ApiOperation({ summary: 'Get GitHub repositories' })
  @ApiResponse({
    status: 200,
    description: 'List of repositories (forks filtered, sorted by stars)',
    type: ReposResponseDto,
  })
  async getRepos(): Promise<ReposResponseDto> {
    const repos = await this.reposService.getRepos();
    return { repos };
  }
}
