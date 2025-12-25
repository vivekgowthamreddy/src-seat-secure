import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seat, SeatDocument } from './schemas/seat.schema';

@Injectable()
export class SeatsService {
  constructor(@InjectModel(Seat.name) private seatModel: Model<SeatDocument>) {}

  async findByShow(showId: string) {
    return this.seatModel.find({ showId }).lean();
  }

  async createMany(items: Partial<Seat>[]) {
    return this.seatModel.insertMany(items);
  }
}
