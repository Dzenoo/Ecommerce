'use client';

import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/utilities/chart';

type TopSellingProductsProps = {
  data: { id: string; items: { product: string; quantity: number }[] }[];
};

const chartConfig = {
  quantity: {
    label: 'Sales',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const TopSellingProducts: React.FC<TopSellingProductsProps> = ({ data }) => {
  const aggregatedSales = data.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        acc[item.product] = (acc[item.product] || 0) + item.quantity;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  let chartData = Object.entries(aggregatedSales).map(
    ([product, quantity]) => ({
      product,
      quantity,
    }),
  );

  // If no data exists, provide a dummy entry so the chart still renders
  if (chartData.length === 0) {
    chartData = [{ product: 'No Sales', quantity: 0 }];
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>
          Identify the most popular products for targeted restocking and
          marketing efforts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="product"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => String(Math.round(value))}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="quantity"
              fill={chartConfig.quantity.color}
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Data is updated periodically
        </div>
        <div className="leading-none text-muted-foreground">
          Aggregated sales from recent orders.
        </div>
      </CardFooter>
    </Card>
  );
};

export default TopSellingProducts;
