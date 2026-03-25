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

import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';
import { ClerkRolesGuard } from '@/common/guards/clerk-roles.guard';

import { ParseMongoIdPipe } from '@/common/pipes/parse-mongo-id.pipe';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async createOrder(
    @Body() body: CreateOrderDto,
    @User('userId') userId: string,
  ) {
    return this.orderService.create(body, userId);
  }

  @Get('/user')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async getOrdersByUser(
    @Query() query: GetOrdersDto,
    @User('userId') userId: string,
  ) {
    return this.orderService.getAllByUser(query, userId);
  }

  @Delete('/delete/:id')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.User)
  async cancelOrder(
    @Param('id', ParseMongoIdPipe) id: string,
    @User('userId') userId: string,
  ) {
    return this.orderService.cancel(id, userId);
  }

  @Get('/all')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async getOrders(@Query() query: GetOrdersDto) {
    return this.orderService.getAll(query);
  }

  @Get('/:id')
  @UseGuards(ClerkAuthGuard)
  async getOrder(
    @Param('id', ParseMongoIdPipe) id: string,
    @User('userId') userId: string,
    @User('role') role: string,
  ) {
    return this.orderService.getOne(id, userId, role);
  }

  @Patch('/update/:id')
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async updateOrderStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() body: UpdateOrderDto,
  ) {
    return this.orderService.updateStatus(id, body.status);
  }
}
