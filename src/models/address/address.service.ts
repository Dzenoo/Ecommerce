import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './schema/address.schema';
import { Model } from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';
import { UserService } from '../user/user.service';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
    private readonly userService: UserService,
  ) {}

  async create(
    body: CreateAddressDto,
    userId: string,
  ): Promise<ResponseObject> {
    const address = await this.addressModel.create({
      ...body,
      user: userId,
    });

    if (!address)
      throw new NotAcceptableException('Address could not be created');

    await this.userService.findOneByIdAndUpdate(userId, {
      $push: { addresses: address._id },
    });

    return {
      statusCode: HttpStatus.CREATED,
      address,
    };
  }

  async update(
    id: string,
    body: UpdateAddressDto,
    userId: string,
  ): Promise<ResponseObject> {
    const address = await this.addressModel.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      body,
      { new: true, runValidators: true },
    );

    if (!address)
      throw new NotAcceptableException('Address could not be updated');

    return {
      statusCode: HttpStatus.CREATED,
      address,
    };
  }

  async delete(id: string, userId: string): Promise<ResponseObject> {
    const address = await this.addressModel.findOneAndDelete({
      _id: id,
      user: userId,
    });

    await this.userService.findOneByIdAndUpdate(userId, {
      $pull: { addresses: id },
    });

    if (!address)
      throw new NotAcceptableException('Address could not be deleted');

    return {
      statusCode: HttpStatus.OK,
      message: 'Address deleted successfully',
    };
  }

  async getAll(userId: string): Promise<ResponseObject> {
    const addresses = await this.addressModel.find({ user: userId });

    return {
      statusCode: HttpStatus.OK,
      addresses,
    };
  }
}
