'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

const SampleOrders = [
  {
    id: 1,
    createdAt: '2025-02-01T10:30:00Z',
    status: 'completed',
    totalAmount: 100.0,
  },
  {
    id: 2,
    createdAt: '2025-02-02T12:15:00Z',
    status: 'completed',
    totalAmount: 150.0,
  },
  {
    id: 3,
    createdAt: '2025-01-15T08:20:00Z',
    status: 'completed',
    totalAmount: 200.0,
  },
  {
    id: 4,
    createdAt: '2025-01-28T14:45:00Z',
    status: 'completed',
    totalAmount: 300.0,
  },
];

const aggregateOrdersByMonth = (orders: any) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June'];
  const aggregated = monthNames.map((month) => ({ month, totalSales: 0 }));

  orders.forEach((order: any) => {
    const date = new Date(order.createdAt);
    const monthIndex = date.getUTCMonth();
    aggregated[monthIndex].totalSales += order.totalAmount;
  });

  return aggregated;
};

const chartData = aggregateOrdersByMonth(SampleOrders);

const chartConfig = {
  totalSales: {
    label: 'Total Sales',
    color: '#2563eb',
  },
} satisfies ChartConfig;

// Why: Track revenue trends over time to monitor overall store performance.

// X-axis: Last 30 days
// Y-axis: Sales amount (€ or dinars)

const SalesPerformance: React.FC = () => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
        <CardDescription>Showing last 6 months of sales</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `€${value}`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="totalSales"
              type="monotone"
              fill="var(--color-totalSales)"
              fillOpacity={0.2}
              stroke="var(--color-totalSales)"
              stackId="a"
            />
          </AreaChart>
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

export default SalesPerformance;
