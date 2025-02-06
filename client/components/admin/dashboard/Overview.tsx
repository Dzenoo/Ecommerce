import React from 'react';

import { ClipboardList, DollarSign, ShoppingBag, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

type OverviewProps = {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  totalUsers: number;
  ordersThisMonth: number;
  productsThisMonth: number;
  revenueThisMonth: number;
  usersThisMonth: number;
};

type CardStatus = 'positive' | 'negative' | 'neutral';

const Overview: React.FC<OverviewProps> = ({
  totalOrders,
  totalProducts,
  totalRevenue,
  totalUsers,
  ordersThisMonth,
  productsThisMonth,
  revenueThisMonth,
  usersThisMonth,
}) => {
  const getIncrementStatus = (value: number): CardStatus => {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatIncrementValue = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value}`;
  };

  const statusColors: Record<CardStatus, string> = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-yellow-500',
  };

  const cardConfig = [
    {
      id: 1,
      title: 'Total Orders',
      value: totalOrders,
      increment: ordersThisMonth,
      icon: ClipboardList,
      iconColor: '#008ECC',
      formatter: (v: number) => v.toLocaleString(),
    },
    {
      id: 2,
      title: 'Total Products',
      value: totalProducts,
      increment: productsThisMonth,
      icon: ShoppingBag,
      iconColor: '#F59E0B',
      formatter: (v: number) => v.toLocaleString(),
    },
    {
      id: 3,
      title: 'Total Revenue',
      value: totalRevenue,
      increment: revenueThisMonth,
      icon: DollarSign,
      iconColor: '#10B981',
      formatter: formatCurrency,
    },
    {
      id: 4,
      title: 'Total Users',
      value: totalUsers,
      increment: usersThisMonth,
      icon: Users,
      iconColor: '#EF4444',
      formatter: (v: number) => v.toLocaleString(),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5 max-xl:grid-cols-2 max-md:grid-cols-1">
      {cardConfig.map(
        ({ id, title, value, increment, icon: Icon, iconColor, formatter }) => {
          const status = getIncrementStatus(increment);
          const displayValue = formatter(value);

          return (
            <Card className="shadow-none" key={id}>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: iconColor }}
                      className="flex aspect-square size-10 items-center justify-center rounded-lg text-white"
                    >
                      <Icon className="size-5" />
                    </div>
                    <p className="text-xl font-semibold">{displayValue}</p>
                  </div>
                  <div>
                    <p
                      className={`whitespace-nowrap text-base ${statusColors[status]}`}
                    >
                      {formatIncrementValue(increment)} this month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        },
      )}
    </div>
  );
};

export default Overview;
