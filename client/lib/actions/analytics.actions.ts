import { getApiHandler } from '../api';

export const getAnalytics = async (): Promise<
  ServerResponse<{
    data: {
      overview: {
        totalOrders: number;
        ordersThisMonth: number;
        totalProducts: number;
        productsThisMonth: number;
        totalUsers: number;
        usersThisMonth: number;
        totalRevenue: number;
        revenueThisMonth: number;
      };
      salesPerformance: {
        _id: string;
        status: string;
        totalPrice: number;
        createdAt: string;
      }[];
      ordersByStatus: {
        id: string;
        status: string;
      }[];
      topSellingProducts: {
        id: string;
        items: {
          product: string;
          quantity: number;
        }[];
      }[];
      customerGrowth: {
        id: string;
        createdAt: string;
      }[];
    };
  }>
> => {
  return await getApiHandler('analytics');
};
