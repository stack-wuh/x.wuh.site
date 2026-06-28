import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FootprintService } from './footprint.service';

@ApiTags('Footprint')
@Controller('footprints')
export class FootprintController {
  constructor(private readonly footprintService: FootprintService) {}

  @Get()
  @ApiOperation({ summary: '获取所有足迹（公开）' })
  @ApiResponse({ status: 200, description: '足迹列表' })
  async findAll() {
    return { data: await this.footprintService.findAll() };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单条足迹' })
  @ApiResponse({ status: 200, description: '足迹详情' })
  @ApiResponse({ status: 404, description: '足迹不存在' })
  async findById(@Param('id') id: string) {
    return this.footprintService.findById(id);
  }
}
