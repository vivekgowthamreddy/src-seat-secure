import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ShowsModule } from '../shows/shows.module';
import { SeatsModule } from '../seats/seats.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [ShowsModule, SeatsModule, BookingsModule],
  controllers: [AdminController],
})
export class AdminModule {}
