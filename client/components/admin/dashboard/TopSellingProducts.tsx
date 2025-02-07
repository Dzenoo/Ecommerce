'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
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

const SampleProducts = [
  {
    id: 1,
    items: [
      { product: 'T-shirt', quantity: 2 },
      { product: 'Jacket', quantity: 1 },
      { product: 'ASDA', quantity: 5 },
      { product: 'Aasd', quantity: 6 },
      { product: 'Aasdsad', quantity: 9 },
    ],
  },
  {
    id: 2,
    items: [
      { product: 'Other', quantity: 3 },
      { product: 'Other Example', quantity: 1 },
    ],
  },
];

const aggregatedSales = SampleProducts.reduce(
  (acc, order) => {
    order.items.forEach((item) => {
      acc[item.product] = (acc[item.product] || 0) + item.quantity;
    });
    return acc;
  },
  {} as Record<string, number>,
);

const chartData = Object.entries(aggregatedSales).map(
  ([product, quantity]) => ({
    product,
    quantity,
  }),
);

const chartConfig = {
  quantity: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const TopSellingProducts: React.FC = () => {
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
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Aggregated sales from recent orders.
        </div>
      </CardFooter>
    </Card>
  );
};

export default TopSellingProducts;
