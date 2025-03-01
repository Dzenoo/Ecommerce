import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CartService } from './cart.service';

import { User } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';

import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async addItem(
    @User('userId') userId: string,
    @Body() { productId, quantity, attributes }: AddItemDto,
  ) {
    return this.cartService.add(userId, productId, quantity, attributes);
  }

  @Delete('/remove/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async removeItem(
    @User('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.remove(userId, itemId);
  }

  @Patch('/update/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async updateItem(
    @User('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() { action }: UpdateItemDto,
  ) {
    return this.cartService.update(userId, itemId, action);
  }

  @Get('/get')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async getCart(@User('userId') userId: string) {
    return this.cartService.get(userId);
  }

  @Delete('/clear')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async clearCart(@User('userId') userId: string) {
    return this.cartService.clear(userId);
  }
}
