import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, mongo } from 'mongoose';

import { Order } from './schema/order.schema';

import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async find(
    query: FilterQuery<Order> = {},
    select?: string,
    populate?: string,
  ): Promise<Order[]> {
    return await this.orderModel
      .find(query)
      .select(select)
      .populate(populate)
      .lean()
      .exec();
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

    let orderAddress;
    if (body.addressId) {
      orderAddress = body.addressId;
    } else if (body.address) {
      orderAddress = body.address;
    } else {
      throw new NotAcceptableException(
        'Either addressId or address details must be provided',
      );
    }

    const order = await this.orderModel.create({
      user: new mongoose.Types.ObjectId(userId),
      items: cart.items,
      totalPrice: cart.totalPrice,
      address: orderAddress,
    });
    if (!order) throw new NotAcceptableException('Order could not be created');

    await this.cartService.clear(userId);
    await this.userService.findOneByIdAndUpdate(userId, {
      $push: { orders: order._id },
    });

    for (const item of cart.items) {
      const product = await this.productService.findById(String(item.product));

      if (!product || product.stock < item.quantity) {
        throw new NotAcceptableException(
          `Not enough stock for ${product?.name}`,
        );
      }

      await this.productService.findAndUpdateMany(
        {
          _id: item.product,
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
      );
    }

    return {
      statusCode: HttpStatus.CREATED,
      order,
      message: 'Order successfully created',
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
      .populate('items.product', 'name images price category')
      .populate('user', 'first_name last_name _id')
      .lean()
      .exec();

    if (!orders)
      return {
        statusCode: HttpStatus.NOT_FOUND,
        orders: [],
      };

    const totalOrders = await this.orderModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      orders,
      totalOrders,
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
      message: 'Order status updated successfully',
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
      message: 'Order canceled successfully',
    };
  }
}
