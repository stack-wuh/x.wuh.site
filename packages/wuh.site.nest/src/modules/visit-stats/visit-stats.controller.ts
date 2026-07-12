import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { VisitStatsService } from './visit-stats.service';
import { VisitStatsResponse } from '@wuh.site/shared-contracts';

interface RecordVisitDto {
  path?: string;
}

@ApiTags('Visit Stats')
@Controller('visit-stats')
export class VisitStatsController {
  constructor(private readonly visitStatsService: VisitStatsService) {}

  @Post('stats')
  @ApiOperation({ summary: '上报一次访问' })
  @ApiResponse({ status: 201, description: '访问记录已创建' })
  async recordVisit(@Body() body: RecordVisitDto, @Req() req: Request) {
    // 优先取 x-forwarded-for（生产环境 Nginx/Docker 代理透传），兜底 req.ip
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.ip ?? 'unknown';

    const userAgent = req.headers['user-agent'];
    await this.visitStatsService.recordVisit(ip, userAgent, body.path);
    return { success: true };
  }

  @Get('stats')
  @ApiOperation({ summary: '获取访问统计' })
  @ApiResponse({ status: 200, description: '访问统计数据' })
  async getStats(): Promise<VisitStatsResponse> {
    return this.visitStatsService.getStats();
  }
}
