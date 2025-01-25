import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async create(body: CreateOrderDto): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.CREATED,
    };
  }

  async getAll(query: GetOrdersDto): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.OK,
    };
  }

  async getOne(id: string): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.OK,
    };
  }

  async getAllByUser(userId: string): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.OK,
    };
  }

  async updateStatus(id: string, status: string): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.CREATED,
    };
  }

  async cancel(id: string): Promise<ResponseObject> {
    return {
      statusCode: HttpStatus.OK,
    };
  }
}
