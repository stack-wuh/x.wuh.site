import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AboutTimelineService } from './about-timeline.service';

@ApiTags('About')
@Controller('about')
export class AboutTimelineController {
  constructor(private readonly aboutTimelineService: AboutTimelineService) {}

  @Get('timeline')
  @ApiOperation({ summary: '获取「最近日志」跨平台动态时间线（GitHub/豆瓣/微信读书/站内，部分降级聚合）' })
  @ApiResponse({ status: 200, description: '按时间降序的动态条目列表与各源状态' })
  async getTimeline() {
    return this.aboutTimelineService.getTimeline();
  }
}
