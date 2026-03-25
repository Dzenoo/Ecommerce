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

type SalesPerformanceProps = {
  data: {
    _id: { year: number; month: number };
    totalRevenue: number;
    orderCount: number;
  }[];
};

const chartConfig = {
  totalSales: {
    label: 'Total Sales',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const SalesPerformance: React.FC<SalesPerformanceProps> = ({ data }) => {
  // Build last 6 months as base, then fill in data from API
  const now = new Date();
  const months: { key: string; label: string; totalSales: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      totalSales: 0,
    });
  }

  (data || []).forEach((entry) => {
    const key = `${entry._id.year}-${entry._id.month}`;
    const month = months.find((m) => m.key === key);
    if (month) month.totalSales = entry.totalRevenue;
  });

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
        <CardDescription>Showing last 6 months of sales</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={months}
            margin={{
              top: 15,
              left: -2,
              right: 12,
            }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
