import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Seat, SeatDocument } from './schemas/seat.schema';
import { GlobalSeat, GlobalSeatDocument } from './schemas/global-seat.schema';

@Injectable()
export class SeatsService {
  constructor(
    @InjectModel(Seat.name) private seatModel: Model<SeatDocument>,
    @InjectModel(GlobalSeat.name) private globalSeatModel: Model<GlobalSeatDocument>
  ) { }

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

  async getGlobalSeats() {
    return this.globalSeatModel.find().lean();
  }

  async toggleGlobalDamage(seatLabel: string, isDamaged: boolean) {
    // 1. Update Global Registry
    await this.globalSeatModel.updateOne(
      { seatLabel },
      { isDamaged },
      { upsert: true }
    );

    // 2. Update ALL existing seats for all shows
    // If marking as damaged, overwrite everything that isn't booked? 
    // Actually, physically damaged seats cannot be booked, so we force update.
    if (isDamaged) {
      await this.seatModel.updateMany(
        { seatLabel, status: { $ne: 'booked' } }, // Optional: protect booked seats? Or just force it? Usually force.
        { status: 'damaged' }
      );
    } else {
      // If marking as repaired, set back to available ONLY if it was 'damaged'. 
      // Do not touch 'booked' or explicitly 'unavailable' (maintenance) seats if distinguished.
      await this.seatModel.updateMany(
        { seatLabel, status: 'damaged' },
        { status: 'available' }
      );
    }

    return { success: true };
  }

  async generateSeats(showId: string) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
    const seats: Partial<Seat>[] = [];
    const showObjectId = new Types.ObjectId(showId);

    // Fetch global damaged status
    const globalDamaged = await this.globalSeatModel.find({ isDamaged: true }).lean();
    const damagedSet = new Set(globalDamaged.map(s => s.seatLabel));

    for (const row of rows) {
      // Rows A-L have 38 seats, M-R have 34
      const isShort = ['M', 'N', 'O', 'P', 'Q', 'R'].includes(row);
      const limit = isShort ? 34 : 38;

      for (let i = 1; i <= limit; i++) {
        const label = `${row}${i}`;
        seats.push({
          showId: showObjectId,
          seatLabel: label,
          row,
          number: i,
          status: damagedSet.has(label) ? 'damaged' : 'available',
        });
      }
    }

    return this.createMany(seats);
  }
}
