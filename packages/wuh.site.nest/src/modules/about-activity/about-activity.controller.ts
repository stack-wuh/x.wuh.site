import { Controller, Get } from '@nestjs/common';
import { AboutActivityService } from './about-activity.service';

@Controller('about/activity')
export class AboutActivityController {
  constructor(private readonly aboutActivityService: AboutActivityService) {}

  @Get()
  getActivity() {
    return this.aboutActivityService.getActivity();
  }
}
