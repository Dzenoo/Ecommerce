import {
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';
import { withTransaction } from '@/common/utils';

import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';

const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  Pending: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

@Injectable()
export class OrderService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(body: CreateOrderDto, userId: string): Promise<ResponseObject> {
    const cart = await this.db.cart.findOne({
      _id: body.cartId,
      user: userId,
    });
    if (!cart) throw new NotAcceptableException('Cart not found');
    if (!cart.items.length) throw new NotAcceptableException('Cart is empty');

    let orderAddress;
    if (body.addressId) {
      const address = await this.db.address.findOne({
        _id: body.addressId,
        user: userId,
      });
      if (!address) {
        throw new NotAcceptableException('Address not found');
      }
      orderAddress = body.addressId;
    } else if (body.address) {
      orderAddress = body.address;
    } else {
      throw new NotAcceptableException(
        'Either addressId or address details must be provided',
      );
    }

    // Validate stock for all items before starting transaction
    const productIds = cart.items.map((item) => String(item.product));
    const products = await this.db.product.find({
      _id: { $in: productIds },
      isDeleted: { $ne: true },
    });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // Freeze unit pricing/discounts per order item.
    const orderItems: {
      product: any;
      quantity: number;
      unitPrice: number;
      discountPercent: number;
      finalUnitPrice: number;
    }[] = [];

    let discountedTotalPrice = 0;
    for (const item of cart.items) {
      const product = productMap.get(String(item.product));
      if (!product) {
        throw new NotAcceptableException(
          `Product not found: ${String(item.product)}`,
        );
      }
      if (product.stock < item.quantity) {
        throw new NotAcceptableException(
          `Not enough stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
        );
      }

      const discountPercent = product.discount ?? 0;
      const unitPrice = product.price;
      const finalUnitPrice =
        Math.round(unitPrice * (1 - discountPercent / 100) * 100) / 100;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        unitPrice,
        discountPercent,
        finalUnitPrice,
      });

      discountedTotalPrice += finalUnitPrice * item.quantity;
    }

    // Use transaction for atomic order creation + stock deduction
    const order = await withTransaction(this.connection, async (session) => {
      // Atomically decrement stock (fails if stock goes below 0)
      for (const item of cart.items) {
        const result = await this.db.product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          { $inc: { stock: -item.quantity } },
          { new: true, session },
        );

        if (!result) {
          throw new NotAcceptableException(
            `Not enough stock for "${productMap.get(String(item.product))?.name}"`,
          );
        }
      }

      // Create order
      const [created] = await this.db.order.create(
        [
          {
            user: new mongoose.Types.ObjectId(userId),
            items: orderItems,
            totalPrice: Math.round(discountedTotalPrice * 100) / 100,
            address: orderAddress,
          },
        ],
        { session },
      );

      // Update user's orders array
      await this.db.user.findByIdAndUpdate(
        userId,
        { $push: { orders: created._id } },
        { session },
      );

      // Clear cart
      await this.db.cart.deleteOne({ user: userId }, { session });
      await this.db.user.findByIdAndUpdate(
        userId,
        { $set: { cart: null } },
        { session },
      );

      return created;
    });

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
      .populate('items.product', 'name images price discount')
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
      .populate('items.product', 'name images price discount')
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
      .populate('items.product', 'name images price discount category')
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
    const order = await this.db.order.findById(id);
    if (!order) throw new NotAcceptableException('Order not found');

    const allowedTransitions = VALID_STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions || !allowedTransitions.includes(status)) {
      throw new NotAcceptableException(
        `Cannot transition from "${order.status}" to "${status}"`,
      );
    }

    // If admin is cancelling, restore stock
    if (status === 'Cancelled') {
      await this.restoreStock(order);
    }

    order.status = status;
    await order.save();

    return {
      statusCode: HttpStatus.OK,
      order,
      message: 'Order status updated successfully',
    };
  }

  async cancel(id: string, userId: string): Promise<ResponseObject> {
    const order = await this.db.order.findOne({
      _id: id,
      user: userId,
    });

    if (!order) throw new NotAcceptableException('Order not found');

    if (order.status === 'Cancelled') {
      throw new NotAcceptableException('Order is already cancelled');
    }

    const allowedTransitions = VALID_STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions || !allowedTransitions.includes('Cancelled')) {
      throw new NotAcceptableException(
        `Cannot cancel an order with status "${order.status}"`,
      );
    }

    // Restore stock for all items in the order
    await this.restoreStock(order);

    order.status = 'Cancelled';
    await order.save();

    return {
      statusCode: HttpStatus.OK,
      order,
      message: 'Order canceled successfully',
    };
  }

  private async restoreStock(order: any): Promise<void> {
    for (const item of order.items) {
      await this.db.product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }
}
