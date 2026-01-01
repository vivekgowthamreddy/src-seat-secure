import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Seat, SeatDocument } from './schemas/seat.schema';

@Injectable()
export class SeatsService {
  constructor(@InjectModel(Seat.name) private seatModel: Model<SeatDocument>) { }

  async findByShow(showId: string) {
    return this.seatModel.find({ showId: new Types.ObjectId(showId) }).lean();
  }

  async createMany(items: Partial<Seat>[]) {
    return this.seatModel.insertMany(items);
  }

  async deleteByShow(showId: string) {
    return this.seatModel.deleteMany({ showId: new Types.ObjectId(showId) });
  }

  async updateStatus(showId: string, seatLabel: string, status: string) {
    return this.seatModel.updateOne(
      { showId: new Types.ObjectId(showId), seatLabel },
      { status }
    );
  }

  async generateSeats(showId: string) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
    const seats: Partial<Seat>[] = [];
    const showObjectId = new Types.ObjectId(showId);

    for (const row of rows) {
      // Rows A-L have 38 seats, M-R have 34
      const isShort = ['M', 'N', 'O', 'P', 'Q', 'R'].includes(row);
      const limit = isShort ? 34 : 38;

      for (let i = 1; i <= limit; i++) {
        seats.push({
          showId: showObjectId,
          seatLabel: `${row}${i}`,
          row,
          number: i,
          status: 'available',
        });
      }
    }

    return this.createMany(seats);
  }
}
