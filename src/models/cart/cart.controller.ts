import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CartService } from './cart.service';

import { AddItemDto } from './dto/add-item.dto';

@Controller('/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add/:userId')
  async addItem(
    @Param('userId') userId: string,
    @Body() { productId, quantity }: AddItemDto,
  ) {
    return this.cartService.add(userId, productId, quantity);
  }

  @Delete('/remove/:userId/:productId')
  async removeItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.remove(userId, productId);
  }

  @Patch('/update/:userId/:productId')
  async updateItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.update(userId, productId, quantity);
  }

  @Get('/:userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.get(userId);
  }

  @Delete('/clear/:userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clear(userId);
  }
}
