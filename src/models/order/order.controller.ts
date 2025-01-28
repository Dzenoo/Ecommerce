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

import { User } from '@/common/decorators/user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';

import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getOrdersByUser(
    @Query() query: GetOrdersDto,
    @User('userId') userId: string,
  ) {
    return this.orderService.getAllByUser(query, userId);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getOrders(@Query() query: GetOrdersDto) {
    return this.orderService.getAll(query);
  }

  @Get('/:id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOne(id);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderDto,
  ) {
    return this.orderService.updateStatus(id, body.status);
  }
}
