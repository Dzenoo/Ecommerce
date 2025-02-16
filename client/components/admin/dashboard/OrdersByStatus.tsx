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

type OrdersByStatusProps = {
  data: { id: number; status: string }[];
};

const chartConfig = {
  pending: {
    label: 'Pending',
    color: '#2563eb',
  },
  completed: {
    label: 'Completed',
    color: '#60a8fb',
  },
  shipped: {
    label: 'Shipped',
    color: '#3b86f7',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#bedcfe',
  },
} satisfies ChartConfig;

const OrdersByStatus: React.FC<OrdersByStatusProps> = ({ data }) => {
  const groupedData = data.reduce((acc: Record<string, number>, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  let pieChartData = Object.entries(groupedData).map(([status, count]) => ({
    status,
    count,
  }));

  if (data.length === 0) {
    pieChartData = [{ status: 'No Orders', count: 1 }];
  }

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
                    chartConfig[entry.status as keyof typeof chartConfig]
                      ?.color || '#e5e7eb'
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
              Data is updated periodically
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Last updated: Today
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrdersByStatus;
