import { Controller, Patch, Body, Param } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { UpdateContentMetadataDto } from '../content/dto/content.dto';

// TODO: Implement admin guard
@Controller('admin')
export class AdminController {
  constructor(private contentService: ContentService) {}

  @Patch('content/:id/metadata')
  async updateContentMetadata(
    @Param('id') id: string,
    @Body() metadata: UpdateContentMetadataDto,
  ) {
    return this.contentService.updateMetadata(Number(id), metadata);
  }
}
