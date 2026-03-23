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
import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';
import { ClerkRolesGuard } from '@/common/guards/clerk-roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';

import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async addItem(
    @User('userId') userId: string,
    @Body() { productId, quantity, attributes }: AddItemDto,
  ) {
    return this.cartService.add(userId, productId, quantity, attributes);
  }

  @Delete('/remove/:itemId')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async removeItem(
    @User('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.remove(userId, itemId);
  }

  @Patch('/update/:itemId')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async updateItem(
    @User('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() { action }: UpdateItemDto,
  ) {
    return this.cartService.update(userId, itemId, action);
  }

  @Get('/get')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async getCart(@User('userId') userId: string) {
    return this.cartService.get(userId);
  }

  @Delete('/clear')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async clearCart(@User('userId') userId: string) {
    return this.cartService.clear(userId);
  }
}
