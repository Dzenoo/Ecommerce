import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@/models/user/user.service';
import { ProductService } from '@/models/product/product.service';
import { OrderService } from '@/models/order/order.service';
import { OrderDocument } from '@/models/order/schema/order.schema';
import { UserDocument } from '@/models/user/schema/user.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}

  async getOverview(): Promise<ResponseObject> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalOrders = await this.orderService.countDocuments({});
    const ordersThisMonth = await this.orderService.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const totalProducts = await this.productService.countDocuments({});
    const productsThisMonth = await this.productService.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const totalUsers = await this.userService.countDocuments({});
    const usersThisMonth = await this.userService.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const allOrders = await this.orderService.find({});
    const totalRevenue = allOrders.reduce(
      (totalAmount, order) => (totalAmount += order.totalPrice),
      0,
    );

    const ordersThisMonthList = await this.orderService.find({
      createdAt: { $gte: startOfMonth },
    });
    const revenueThisMonth = ordersThisMonthList.reduce(
      (totalAmount, order) => totalAmount + order.totalPrice,
      0,
    );

    return {
      statusCode: HttpStatus.OK,
      data: {
        totalOrders,
        ordersThisMonth,
        totalProducts,
        productsThisMonth,
        totalUsers,
        usersThisMonth,
        totalRevenue,
        revenueThisMonth,
      },
    };
  }

  async getSalesPerformance(): Promise<ResponseObject> {
    const allOrders = await this.orderService.find(
      {},
      'status createdAt totalPrice _id',
    );

    const completedOrders = allOrders.filter(
      (order) => order.status === 'completed',
    );

    return {
      statusCode: HttpStatus.OK,
      data: completedOrders,
    };
  }

  async getOrdersByStatus(): Promise<ResponseObject> {
    const allOrders = await this.orderService.find({}, 'status _id');

    const transformedOrders = allOrders.map((order: OrderDocument) => {
      return {
        id: order._id,
        status: order.status,
      };
    });

    return {
      statusCode: HttpStatus.OK,
      data: transformedOrders,
    };
  }

  async getTopSellingProducts(): Promise<ResponseObject> {
    const allOrders = await this.orderService.find({}, 'items _id');

    const transformedOrders = allOrders.map((order: OrderDocument) => {
      return {
        id: order._id,
        items: order.items.map((item) => ({
          product: item.product.name,
          quantity: item.quantity,
        })),
      };
    });

    return {
      statusCode: HttpStatus.OK,
      data: transformedOrders,
    };
  }

  async getCustomerGrowth(): Promise<ResponseObject> {
    const allUsers = await this.userService.find({}, 'createdAt _id');

    const transformedUsers = allUsers.map((user: UserDocument) => ({
      id: user._id,
      ...user,
    }));

    return {
      statusCode: HttpStatus.OK,
      data: transformedUsers,
    };
  }
}
