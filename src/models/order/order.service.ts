import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import mongoose, { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly cartService: CartService,
  ) {}

  async create(body: CreateOrderDto, userId: string): Promise<ResponseObject> {
    const cart = await this.cartService.findOne({
      _id: body.cartId,
      user: userId,
    });
    if (!cart) throw new NotAcceptableException('Cart not found');

    const order = await this.orderModel.create({
      user: new mongoose.Types.ObjectId(userId),
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress: body.shippingAddress,
      manualShippingAddress: body.manualShippingAddress,
    });
    if (!order) throw new NotAcceptableException('Order could not be created');

    await this.cartService.clear(userId);

    return {
      statusCode: HttpStatus.CREATED,
      order,
    };
  }

  async getAll({
    page = 1,
    limit = 10,
    sort,
    status,
  }: GetOrdersDto): Promise<ResponseObject> {
    const conditions: any = {};

    if (status) {
      conditions.status = status;
    }

    const sortOptions: any = { createdAt: sort === 'desc' ? -1 : 1 };

    const orders = await this.orderModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'first_name last_name image')
      .populate('items.product', 'name image price')
      .lean()
      .exec();

    const totalOrders = await this.orderModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      orders,
      totalOrders,
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
