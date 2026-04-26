import { Controller, Get } from '@nestjs/common';
import { ApiV2Service } from './api-v2.service';
import { ApiVersion } from './dto/api.dto';

@Controller()
export class ApiV2Controller {
  constructor(private readonly apiV2Service: ApiV2Service) {}

  @Get()
  getApiDocumentation(): ApiVersion {
    return this.apiV2Service.getApiVersion();
  }

  @Get('endpoints')
  getEndpoints() {
    return this.apiV2Service.getApiVersion().endpoints;
  }
}