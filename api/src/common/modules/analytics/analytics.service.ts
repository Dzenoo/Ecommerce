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
    const [
      overview,
      salesPerformance,
      ordersByStatus,
      topSellingProducts,
      customerGrowth,
    ] = await Promise.all([
      this.getOverview(),
      this.getSalesPerformance(),
      this.getOrdersByStatus(),
      this.getTopSellingProducts(),
      this.getCustomerGrowth(),
    ]);

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

    const revenueFilter = { status: { $ne: 'Cancelled' } };

    const [
      totalOrders,
      ordersThisMonth,
      totalProducts,
      productsThisMonth,
      totalUsers,
      usersThisMonth,
      totalRevenueResult,
      revenueThisMonthResult,
    ] = await Promise.all([
      this.db.order.countDocuments({}),
      this.db.order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      this.db.product.countDocuments({ isDeleted: { $ne: true } }),
      this.db.product.countDocuments({
        isDeleted: { $ne: true },
        createdAt: { $gte: startOfMonth },
      }),
      this.db.user.countDocuments({}),
      this.db.user.countDocuments({ createdAt: { $gte: startOfMonth } }),
      this.db.order.aggregate([
        { $match: revenueFilter },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      this.db.order.aggregate([
        { $match: { ...revenueFilter, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const totalRevenue = totalRevenueResult[0]?.total ?? 0;
    const revenueThisMonth = revenueThisMonthResult[0]?.total ?? 0;

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
    const data = await this.db.order.aggregate([
      {
        $match: {
          status: { $in: ['Delivered', 'Processing', 'Shipped', 'Pending'] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalRevenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return { data };
  }

  private async getOrdersByStatus() {
    const data = await this.db.order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return { data };
  }

  private async getTopSellingProducts() {
    const data = await this.db.order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          product: { $ifNull: ['$product.name', 'Unknown Product'] },
          totalQuantity: 1,
        },
      },
    ]);

    return { data };
  }

  private async getCustomerGrowth() {
    const data = await this.db.user.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return { data };
  }
}
