import {
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import mongoose from 'mongoose';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
    private readonly cartService: CartService,
  ) {}

  async create(body: CreateOrderDto, userId: string): Promise<ResponseObject> {
    const cart = await this.db.cart.findOne({
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

    const order = await this.db.order.create({
      user: new mongoose.Types.ObjectId(userId),
      items: cart.items,
      totalPrice: cart.totalPrice,
      address: orderAddress,
    });
    if (!order) throw new NotAcceptableException('Order could not be created');

    await this.cartService.clear(userId);
    await this.db.user.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
    });

    for (const item of cart.items) {
      const product = await this.db.product.findById(String(item.product));

      if (!product || product.stock < item.quantity) {
        throw new NotAcceptableException(
          `Not enough stock for ${product?.name}`,
        );
      }

      await this.db.product.updateMany(
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

    const orders = await this.db.order
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'username email')
      .populate('items.product', 'name images price')
      .lean()
      .exec();

    const totalOrders = await this.db.order.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      orders,
      totalOrders,
    };
  }

  async getOne(
    id: string,
    userId: string,
    role: string,
  ): Promise<ResponseObject> {
    const order = await this.db.order
      .findById(id)
      .populate('user', 'username email')
      .populate('items.product', 'name images price')
      .lean()
      .exec();

    if (!order) throw new NotAcceptableException('Order not found');

    if (
      typeof order.address === 'string' ||
      order.address instanceof mongoose.Types.ObjectId
    ) {
      const address = await this.db.address.findById(String(order.address));
      if (address) order.address = address;
    }

    const isOwner = String(order.user?._id || order.user) === userId;
    if (role !== 'admin' && !isOwner) {
      throw new NotAcceptableException('Not authorized to view this order');
    }

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

    const orders = await this.db.order
      .find(conditions)
      .sort({ createdAt: sort === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('items.product', 'name images price category')
      .populate('user', 'username email _id')
      .lean()
      .exec();

    if (!orders)
      return {
        statusCode: HttpStatus.NOT_FOUND,
        orders: [],
      };

    const totalOrders = await this.db.order.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      orders,
      totalOrders,
    };
  }

  async updateStatus(id: string, status: string): Promise<ResponseObject> {
    const order = await this.db.order.findByIdAndUpdate(
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
    const alreadyCancelled = await this.db.order.findOne({
      _id: id,
      status: 'Cancelled',
    });

    if (alreadyCancelled) {
      throw new NotAcceptableException('Order is already cancelled');
    }

    const order = await this.db.order.findByIdAndUpdate(
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
