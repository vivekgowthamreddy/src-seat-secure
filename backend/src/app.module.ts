import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { ShowsModule } from './shows/shows.module';
import { SeatsModule } from './seats/seats.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') || 'mongodb://localhost/seatsecure',
      }),
    }),
    MoviesModule,
    ShowsModule,
    SeatsModule,
    UsersModule,
    BookingsModule,
    AdminModule,
    AuthModule,
  ],
  providers: [Logger],
})
export class AppModule {}
