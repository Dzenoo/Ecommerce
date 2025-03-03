import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Address } from './schema/address.schema';

import { UserService } from '../user/user.service';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { GetAddressesDto } from './dto/get-addresses.dto';

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
      message: 'Address created successfully',
    };
  }

  async update(
    id: string,
    body: UpdateAddressDto,
    userId: string,
  ): Promise<ResponseObject> {
    const allAddresses = await this.addressModel.find({
      user: userId,
    });

    if (body.isDefault) {
      await Promise.all(
        allAddresses
          .filter((address) => address._id.toString() !== id)
          .map((address) =>
            this.addressModel.findByIdAndUpdate(address._id, {
              isDefault: false,
            }),
          ),
      );
    }

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
      message: 'Address updated successfully',
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

  async getAll(
    query: GetAddressesDto,
    userId: string,
  ): Promise<ResponseObject> {
    const addresses = await this.addressModel
      .find({ user: userId })
      .select('-user')
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();

    if (!addresses) throw new NotAcceptableException('Addresses not found');

    return {
      statusCode: HttpStatus.OK,
      addresses,
      totalAddresses: addresses.length,
    };
  }
}
