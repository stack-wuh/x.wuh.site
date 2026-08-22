import { Module } from '@nestjs/common'
import { ApiV2Controller } from './api-v2.controller'
import { ApiV2Service } from './api-v2.service'
import { HealthController } from './health.controller'
import { GithubModule } from './github/github.module'

@Module({
  imports: [GithubModule],
  controllers: [ApiV2Controller, HealthController],
  providers: [ApiV2Service],
  exports: [ApiV2Service],
})
export class ApiV2Module {}