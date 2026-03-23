import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';

import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async find(query: FilterQuery<User> = {}, select?: string): Promise<User[]> {
    return await this.userModel.find(query).select(select).lean().exec();
  }

  async findOne(query: FilterQuery<User> = {}): Promise<User | null> {
    return await this.userModel.findOne(query).exec();
  }

  async countDocuments(
    query: FilterQuery<User> = {},
    select?: string,
  ): Promise<number> {
    return await this.userModel.countDocuments(query).select(select).exec();
  }

  async findAndUpdateMany(
    query: FilterQuery<User> = {},
    update: UpdateQuery<User> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateMany(query, update).exec();
  }

  async findOneByIdAndUpdate(
    id: string,
    update: UpdateQuery<User> = {},
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, update).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).lean().exec();
  }

  async findOneByEmail(email: string, select?: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).select(select);
  }

  async createOne(body: Record<string, any>): Promise<User> {
    return await this.userModel.create(body);
  }

  async deleteOne(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async getOne(id: string): Promise<ResponseObject> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }
}
