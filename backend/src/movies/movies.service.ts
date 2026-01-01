import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) { }

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().lean();
  }

  async findById(id: string): Promise<Movie> {
    const m = await this.movieModel.findById(id).lean();
    if (!m) throw new NotFoundException('Movie not found');
    return m;
  }

  async create(movie: Partial<Movie>): Promise<Movie> {
    const newMovie = new this.movieModel(movie);
    return newMovie.save();
  }

  async update(id: string, updates: Partial<Movie>): Promise<Movie> {
    const updated = await this.movieModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!updated) throw new NotFoundException('Movie not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.movieModel.findByIdAndDelete(id).lean();
    if (!deleted) throw new NotFoundException('Movie not found');
  }

  async createMany(items: Partial<Movie>[]) {
    return this.movieModel.insertMany(items);
  }
}
