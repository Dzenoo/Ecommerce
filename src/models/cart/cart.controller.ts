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

import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async addItem(
    @User('userId') userId: string,
    @Body() { productId, quantity }: AddItemDto,
  ) {
    return this.cartService.add(userId, productId, quantity);
  }

  @Delete('/remove/:productId')
  @UseGuards(JwtAuthGuard)
  async removeItem(
    @User('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.remove(userId, productId);
  }

  @Patch('/update/:productId')
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @User('userId') userId: string,
    @Param('productId') productId: string,
    @Body() { quantity, action }: UpdateItemDto,
  ) {
    return this.cartService.update(userId, productId, quantity, action);
  }

  @Get('/get')
  @UseGuards(JwtAuthGuard)
  async getCart(@User('userId') userId: string) {
    return this.cartService.get(userId);
  }

  @Delete('/clear')
  @UseGuards(JwtAuthGuard)
  async clearCart(@User('userId') userId: string) {
    return this.cartService.clear(userId);
  }
}
