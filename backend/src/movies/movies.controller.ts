import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto } from './dto/movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get()
  async list(): Promise<MovieDto[]> {
    const movies = await this.moviesService.findAll();
    return movies.map((m: any) => ({ id: m._id, title: m.title, poster: m.posterUrl, description: m.description, duration: m.duration, genre: m.genre, language: m.language }));
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<MovieDto> {
    const m = await this.moviesService.findById(id) as any;
    return { id: m._id, title: m.title, poster: m.posterUrl, description: m.description, duration: m.duration, genre: m.genre, language: m.language };
  }
}
