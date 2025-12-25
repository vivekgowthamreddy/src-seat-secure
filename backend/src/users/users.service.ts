import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean();
  }

  async createUser(user: Partial<User>): Promise<User> {
    const created = new this.userModel(user);
    return created.save();
  }

  async create(user: Partial<User>): Promise<User> {
    return this.createUser(user);
  }
}
