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

import { OrderService } from './order.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';

import { User } from '@/common/decorators/user.decorator';
import { Admin } from '@/common/decorators/admin.decorator';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { AdminGuard } from '@/authentication/guards/admin-auth.guard';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() body: CreateOrderDto,
    @User('userId') userId: string,
  ) {
    return this.orderService.create(body, userId);
  }

  @Get('/all')
  @UseGuards(AdminGuard)
  @Admin()
  async getOrders(@Query() query: GetOrdersDto) {
    return this.orderService.getAll(query);
  }

  @Get('/:id')
  // @UseGuards(AdminGuard)
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOne(id);
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getOrdersByUser(@User('userId') userId: string) {
    return this.orderService.getAllByUser(userId);
  }

  @Patch('/update/:id')
  @UseGuards(AdminGuard)
  @Admin()
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.orderService.updateStatus(id, status);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }
}
