import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowDto } from './dto/show.dto';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) { }

  @Get()
  async list(@Query('movieId') movieId?: string): Promise<ShowDto[]> {
    const filter: any = {};
    if (movieId) filter.movieId = movieId;
    const shows = await this.showsService.findAll(filter);
    return shows.map((s: any) => ({
      id: s._id,
      movieId: s.movieId && typeof s.movieId === 'object' && '_id' in s.movieId
        ? { ...s.movieId, id: s.movieId._id, poster: s.movieId.posterUrl }
        : s.movieId,
      date: s.startTime?.toISOString().slice(0, 10),
      time: s.startTime?.toISOString().slice(11, 16),
      category: s.category,
      bookedSeats: s.bookedSeats,
      totalSeats: s.totalSeats
    }));
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<ShowDto> {
    const s = await this.showsService.findById(id) as any;
    return {
      id: s._id,
      movieId: s.movieId && typeof s.movieId === 'object' && '_id' in s.movieId
        ? { ...s.movieId, id: s.movieId._id, poster: s.movieId.posterUrl }
        : s.movieId,
      date: s.startTime?.toISOString().slice(0, 10),
      time: s.startTime?.toISOString().slice(11, 16),
      category: s.category,
      bookedSeats: s.bookedSeats,
      totalSeats: s.totalSeats
    };
  }
}
