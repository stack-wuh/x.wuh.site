import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { VisitStatsService } from './visit-stats.service';
import { VisitStatsResponse } from '@wuh.site/core';

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
    // XFF 取末段（审计 P1-7）：nginx proxy_add_x_forwarded_for 把真实客户端
    // IP 追加到末尾——取第一段等于信任客户端自报，伪造 IP 即绕过 30 分钟去重
    const forwarded = req.headers['x-forwarded-for'];
    let ip: string;
    if (typeof forwarded === 'string' && forwarded.trim()) {
      const segments = forwarded.split(',').map((s) => s.trim()).filter(Boolean);
      ip = segments[segments.length - 1] ?? req.ip ?? 'unknown';
    } else {
      ip = req.ip ?? 'unknown';
    }
    // 形态防线：截断 + 只留合法 IP 字符（IPv4/IPv6/冒号分流的特征字符）
    ip = ip.slice(0, 45).replace(/[^0-9a-fA-F:.]/g, '') || 'unknown';

    // path 防线：只收站内相对路径，截断 200，剥控制字符（可塞 5MB 文档的洞）
    const rawPath = typeof body.path === 'string' ? body.path : '';
    const path = rawPath.startsWith('/') && !rawPath.includes('://')
      ? rawPath.replace(/[^\x21-\x7e\u4e00-\u9fa5]/g, '').slice(0, 200)
      : undefined;

    const userAgent = req.headers['user-agent'];
    await this.visitStatsService.recordVisit(ip, userAgent, path);
    return { success: true };
  }

  @Get('stats')
  @ApiOperation({ summary: '获取访问统计与全站字数' })
  @ApiResponse({ status: 200, description: '访问统计数据（总访问量 / 今日 / 全站字数）' })
  async getStats(): Promise<VisitStatsResponse> {
    return this.visitStatsService.getStats();
  }
}
