import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';

import { Order } from './schema/order.schema';

import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly cartService: CartService,
    private readonly userService: UserService,
  ) {}

  async find(
    query: FilterQuery<Order> = {},
    select?: string,
  ): Promise<Order[]> {
    return await this.orderModel.find(query).select(select).lean().exec();
  }

  async countDocuments(query: FilterQuery<Order> = {}): Promise<number> {
    return await this.orderModel.countDocuments(query).exec();
  }

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
    await this.userService.findOneByIdAndUpdate(userId, {
      $push: { orders: order._id },
    });

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
    const order = await this.orderModel
      .findById(id)
      .populate('user', 'first_name last_name image')
      .populate('items.product', 'name image price')
      .lean()
      .exec();

    if (!order) throw new NotAcceptableException('Order not found');

    return {
      statusCode: HttpStatus.OK,
      order,
    };
  }

  async getAllByUser(
    { page = 1, limit = 10, sort, status }: GetOrdersDto,
    userId: string,
  ): Promise<ResponseObject> {
    const conditions: any = {
      user: new mongoose.Types.ObjectId(userId),
    };

    if (status) {
      conditions.status = status;
    }

    const orders = await this.orderModel
      .find(conditions)
      .sort({ createdAt: sort === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('items.product', 'name image price')
      .select('-user')
      .lean()
      .exec();

    if (!orders) throw new NotAcceptableException('Orders not found');

    return {
      statusCode: HttpStatus.OK,
      orders,
    };
  }

  async updateStatus(id: string, status: string): Promise<ResponseObject> {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true },
    );

    if (!order)
      throw new NotAcceptableException('Order cannot be updated right now');

    return {
      statusCode: HttpStatus.CREATED,
      order,
    };
  }

  async cancel(id: string): Promise<ResponseObject> {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      {
        status: 'Cancelled',
      },
      { new: true },
    );

    if (!order) throw new NotAcceptableException('Order cannot be cancelled');

    return {
      statusCode: HttpStatus.OK,
      order,
    };
  }
}
