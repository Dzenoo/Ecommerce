'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';

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

const orders = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'completed' },
  { id: 3, status: 'shipped' },
  { id: 4, status: 'cancelled' },
  { id: 5, status: 'completed' },
];

const groupedData = orders.reduce((acc: Record<string, number>, order) => {
  acc[order.status] = (acc[order.status] || 0) + 1;
  return acc;
}, {});

const pieChartData = Object.entries(groupedData).map(([status, count]) => ({
  status,
  count,
}));

const chartConfig = {
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-1))',
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-2))',
  },
  shipped: {
    label: 'Shipped',
    color: 'hsl(var(--chart-3))',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const OrdersByStatus: React.FC = () => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
        <CardDescription>Review orders by their statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieChartData}
              dataKey="count"
              nameKey="status"
              label
              innerRadius={80}
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    chartConfig[entry.status as keyof typeof chartConfig].color
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Profit up by 20% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2025
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrdersByStatus;
