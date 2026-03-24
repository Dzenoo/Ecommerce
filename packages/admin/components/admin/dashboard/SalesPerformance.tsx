'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { formatPrice } from '@shared/lib/utils/currency.utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/layout/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@shared/components/ui/utilities/chart';

type SalesOrder = {
  _id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
};

type SalesPerformanceProps = {
  data: SalesOrder[];
};

const aggregateOrdersByMonth = (orders: SalesOrder[]) => {
  const now = new Date();
  const months: { key: string; label: string }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }

  const aggregated = months.map((m) => ({
    month: m.label,
    totalSales: 0,
    key: m.key,
  }));

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
    const entry = aggregated.find((a) => a.key === key);
    if (entry) entry.totalSales += order.totalPrice;
  });

  return aggregated;
};

const chartConfig = {
  totalSales: {
    label: 'Total Sales',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const SalesPerformance: React.FC<SalesPerformanceProps> = ({ data }) => {
  const chartData = aggregateOrdersByMonth(data);

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
              top: 15,
              left: -2,
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
              tickFormatter={(value) => formatPrice(value)}
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

export default SalesPerformance;
