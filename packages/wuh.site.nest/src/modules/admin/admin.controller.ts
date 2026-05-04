import { Controller, Patch, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from '../content/content.service';
import { UpdateContentMetadataDto } from '../content/dto/content.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private contentService: ContentService) {}

  @Patch('content/:id/metadata')
  @ApiOperation({ summary: 'Update content metadata' })
  @ApiResponse({ status: 200, description: 'Metadata updated' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async updateContentMetadata(
    @Param('id') id: string,
    @Body() metadata: UpdateContentMetadataDto,
  ) {
    const result = await this.contentService.updateMetadata(Number(id), metadata);
    if (!result) {
      throw new NotFoundException(`Content not found: ${id}`);
    }
    return result;
  }
}
