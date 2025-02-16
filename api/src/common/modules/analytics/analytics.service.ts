import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@/models/user/user.service';
import { ProductService } from '@/models/product/product.service';
import { OrderService } from '@/models/order/order.service';

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
}
