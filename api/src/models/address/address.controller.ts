import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AddressService } from './address.service';

import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';
import { User } from '@/common/decorators/user.decorator';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { GetAddressesDto } from './dto/get-addresses.dto';

@Controller('/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async createAddress(
    @Body() body: CreateAddressDto,
    @User('userId') userId: string,
  ) {
    return await this.addressService.create(body, userId);
  }

  @Patch('/update/:addressId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async updateAddress(
    @Body() body: UpdateAddressDto,
    @Param('addressId') addressId: string,
    @User('userId') userId: string,
  ) {
    return await this.addressService.update(addressId, body, userId);
  }

  @Delete('/delete/:addressId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async deleteAddress(
    @Param('addressId') addressId: string,
    @User('userId') userId: string,
  ) {
    return await this.addressService.delete(addressId, userId);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async getAddresses(
    @Query() query: GetAddressesDto,
    @User('userId') userId: string,
  ) {
    return this.addressService.getAll(query, userId);
  }
}
