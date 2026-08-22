import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiV2Service } from './api-v2.service';
import { ApiVersion } from './dto/api.dto';

@ApiTags('API v2')
@Controller()
export class ApiV2Controller {
  constructor(private readonly apiV2Service: ApiV2Service) {}

  @Get()
  @ApiOperation({ summary: 'Get API documentation' })
  @ApiResponse({ status: 200, description: 'API version info' })
  getApiDocumentation(): ApiVersion {
    return this.apiV2Service.getApiVersion();
  }

  @Get('endpoints')
  @ApiOperation({ summary: 'Get available endpoints' })
  @ApiResponse({ status: 200, description: 'List of endpoints' })
  getEndpoints() {
    return this.apiV2Service.getApiVersion().endpoints;
  }
}
