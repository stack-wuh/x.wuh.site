import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WereadController } from './weread.controller';
import { WereadService } from './weread.service';
import { WereadBook, WereadBookSchema } from './schemas/weread.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WereadBook.name, schema: WereadBookSchema },
    ]),
  ],
  controllers: [WereadController],
  providers: [WereadService],
})
export class WereadModule {}
