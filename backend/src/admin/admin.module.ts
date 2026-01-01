import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ShowsModule } from '../shows/shows.module';
import { SeatsModule } from '../seats/seats.module';
import { BookingsModule } from '../bookings/bookings.module';
import { MoviesModule } from '../movies/movies.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ShowsModule, SeatsModule, BookingsModule, MoviesModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule { }
