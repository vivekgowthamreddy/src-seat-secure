import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { Seat, SeatSchema } from './schemas/seat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Seat.name, schema: SeatSchema }])],
  providers: [SeatsService],
  controllers: [SeatsController],
  exports: [SeatsService],
})
export class SeatsModule {}
