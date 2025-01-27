import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

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
}
