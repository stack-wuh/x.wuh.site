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
  @ApiOperation({ summary: 'Get paginated books from database' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of books' })
  async getBooks(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 10;
    return this.wereadService.getBooks(p, l);
  }
}
