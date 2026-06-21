import { Controller, Get, Query } from '@nestjs/common'
import { GithubService } from './github.service'

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('contributions')
  getContributions(@Query('username') username: string) {
    const user = username || 'stack-wuh'
    return this.githubService.getContributions(user)
  }
}
