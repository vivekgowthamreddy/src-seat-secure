import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { Show, ShowSchema } from './schemas/show.schema';
import { Movie, MovieSchema } from '../movies/schemas/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Show.name, schema: ShowSchema }, { name: Movie.name, schema: MovieSchema }]),
  ],
  providers: [ShowsService],
  controllers: [ShowsController],
  exports: [ShowsService],
})
export class ShowsModule {}
