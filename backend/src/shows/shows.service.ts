import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Show, ShowDocument } from './schemas/show.schema';

@Injectable()
export class ShowsService {
  constructor(@InjectModel(Show.name) private showModel: Model<ShowDocument>) {}

  async findAll(filter: Partial<Show> = {}): Promise<Show[]> {
    return this.showModel.find(filter as any).lean();
  }

  async findById(id: string): Promise<Show> {
    const s = await this.showModel.findById(id).lean();
    if (!s) throw new NotFoundException('Show not found');
    return s;
  }

  async createMany(items: Partial<Show>[]) {
    return this.showModel.insertMany(items);
  }

  async createShow(show: Partial<Show>) {
    const newShow = new this.showModel(show);
    return newShow.save();
  }

  async updateShow(id: string, updates: Partial<Show>) {
    const updated = await this.showModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!updated) throw new NotFoundException('Show not found');
    return updated;
  }

  async deleteShow(id: string) {
    const deleted = await this.showModel.findByIdAndDelete(id).lean();
    if (!deleted) throw new NotFoundException('Show not found');
    return { message: 'Show deleted', id };
  }
}

