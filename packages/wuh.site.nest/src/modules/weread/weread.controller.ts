import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WereadService } from './weread.service';

@ApiTags('Weread')
@Controller('weread')
export class WereadController {
  constructor(private readonly wereadService: WereadService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Sync books from WeRead API to MongoDB' })
  @ApiResponse({ status: 200, description: 'Books synced successfully' })
  async sync() {
    return this.wereadService.syncBooks();
  }

  @Get('books')
  @ApiOperation({ summary: 'Get books from database' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of books' })
  async getBooks(@Query('limit') limit?: string) {
    const books = await this.wereadService.getBooks(limit ? parseInt(limit, 10) : undefined);
    return { books };
  }
}
