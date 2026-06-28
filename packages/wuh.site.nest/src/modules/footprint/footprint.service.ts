import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Footprint, FootprintDocument } from './footprint.schema';

@Injectable()
export class FootprintService {
  private logger = new Logger(FootprintService.name);

  constructor(
    @InjectModel(Footprint.name) private footprintModel: Model<FootprintDocument>,
  ) {}

  async findAll() {
    return this.footprintModel
      .find()
      .sort({ date: -1 })
      .lean()
      .exec();
  }

  async findById(id: string) {
    return this.footprintModel.findById(id).lean().exec();
  }

  async create(data: Partial<Footprint>): Promise<FootprintDocument> {
    const footprint = new this.footprintModel(data);
    return footprint.save();
  }

  async update(id: string, data: Partial<Footprint>) {
    return this.footprintModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean()
      .exec();
  }

  async delete(id: string) {
    return this.footprintModel.findByIdAndDelete(id).lean().exec();
  }
}
