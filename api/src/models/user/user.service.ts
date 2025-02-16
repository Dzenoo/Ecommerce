import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';

import { User } from './schema/user.schema';

import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async find(query: FilterQuery<User> = {}, select?: string): Promise<User[]> {
    return await this.userModel.find(query).select(select).lean().exec();
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

  async updateOne(id: string, body: UpdateProfileDto): Promise<ResponseObject> {
    const user = await this.userModel.findById(id).exec();

    if (
      body.first_name === user.first_name &&
      body.last_name === user.last_name
    )
      throw new NotFoundException('No changes found');

    const updatedProfile = await this.userModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedProfile) throw new NotFoundException('User not found');

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Profile updated successfully',
    };
  }

  async getOne(id: string): Promise<ResponseObject> {
    const user = await this.userModel.findById(id).select('-role');

    if (!user) throw new NotFoundException('User not found');

    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }
}
