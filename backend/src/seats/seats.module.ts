import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { Seat, SeatSchema } from './schemas/seat.schema';
import { GlobalSeat, GlobalSeatSchema } from './schemas/global-seat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Seat.name, schema: SeatSchema },
      { name: GlobalSeat.name, schema: GlobalSeatSchema },
    ]),
  ],
  providers: [SeatsService],
  controllers: [SeatsController],
  exports: [SeatsService],
})
export class SeatsModule { }
