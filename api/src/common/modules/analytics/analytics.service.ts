import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '../database/database.types';


@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
  ) {}

  async getAnalytics(): Promise<ResponseObject> {
    const overview = await this.getOverview();
    const salesPerformance = await this.getSalesPerformance();
    const ordersByStatus = await this.getOrdersByStatus();
    const topSellingProducts = await this.getTopSellingProducts();
    const customerGrowth = await this.getCustomerGrowth();

    return {
      statusCode: HttpStatus.OK,
      data: {
        overview: overview.data,
        salesPerformance: salesPerformance.data,
        ordersByStatus: ordersByStatus.data,
        topSellingProducts: topSellingProducts.data,
        customerGrowth: customerGrowth.data,
      },
    };
  }

  private async getOverview() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalOrders = await this.db.order.countDocuments({});
    const ordersThisMonth = await this.db.order.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const totalProducts = await this.db.product.countDocuments({ isDeleted: { $ne: true } });
    const productsThisMonth = await this.db.product.countDocuments({
      isDeleted: { $ne: true },
      createdAt: { $gte: startOfMonth },
    });

    const totalUsers = await this.db.user.countDocuments({});
    const usersThisMonth = await this.db.user.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const [totalRevenueResult] = await this.db.order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = totalRevenueResult?.total ?? 0;

    const [revenueThisMonthResult] = await this.db.order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const revenueThisMonth = revenueThisMonthResult?.total ?? 0;

    return {
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

  private async getSalesPerformance() {
    const orders = await this.db.order
      .find(
        { status: { $in: ['Delivered', 'Processing', 'Shipped', 'Pending'] } },
        'status createdAt totalPrice',
      )
      .lean()
      .exec();

    return {
      statusCode: HttpStatus.OK,
      data: orders.map((o: any) => ({
        _id: o._id.toString(),
        status: o.status,
        totalPrice: o.totalPrice,
        createdAt: new Date(o.createdAt).toISOString(),
      })),
    };
  }

  private async getOrdersByStatus() {
    const allOrders = await this.db.order
      .find({}, 'status')
      .lean()
      .exec();

    return {
      data: allOrders.map((o: any) => ({
        id: o._id.toString(),
        status: o.status,
      })),
    };
  }

  private async getTopSellingProducts() {
    const allOrders = await this.db.order
      .find({}, 'items')
      .populate('items.product', 'name')
      .lean()
      .exec();

    const transformedOrders = allOrders.map((order) => ({
      id: order._id.toString(),
      items: order.items.map((item: any) => ({
        product: item.product?.name || 'Unknown Product',
        quantity: item.quantity,
      })),
    }));

    return {
      data: transformedOrders,
    };
  }

  private async getCustomerGrowth() {
    const allUsers = await this.db.user
      .find({}, 'createdAt')
      .lean()
      .exec();

    return {
      data: allUsers.map((u: any) => ({
        id: u._id.toString(),
        createdAt: new Date(u.createdAt).toISOString(),
      })),
    };
  }
}
