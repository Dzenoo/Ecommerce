'use client';

import { CartesianGrid, Dot, Line, LineChart, XAxis, YAxis } from 'recharts';

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

type CustomerGrowthProps = {
  data: { id: string; createdAt: string }[];
};

const transformData = (customers: { id: string; createdAt: string }[]) => {
  const monthlyCounts: Record<string, number> = {};

  customers.forEach((customer) => {
    const date = new Date(customer.createdAt);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const key = `${year}-${month}`;
    monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
  });

  return Object.keys(monthlyCounts)
    .sort()
    .map((key) => {
      const [year, month] = key.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return {
        month: date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        newCustomers: monthlyCounts[key],
      };
    });
};

const chartConfig = {
  newCustomers: {
    label: 'New Customers',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const CustomerGrowth: React.FC<CustomerGrowthProps> = ({ data }) => {
  let chartData = transformData(data);

  if (chartData.length === 0) {
    chartData = [
      { month: 'Jan 2025', newCustomers: 0 },
      { month: 'Feb 2025', newCustomers: 0 },
      { month: 'Mar 2025', newCustomers: 0 },
      { month: 'Apr 2025', newCustomers: 0 },
      { month: 'May 2025', newCustomers: 0 },
      { month: 'Jun 2025', newCustomers: 0 },
    ];
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Customer Growth</CardTitle>
        <CardDescription>
          Monitor how well you are growing your customer base, especially during
          campaigns or promotions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tickFormatter={(value) => String(Math.round(value))}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="newCustomers"
                  hideLabel
                />
              }
            />
            <Line
              dataKey="newCustomers"
              type="natural"
              stroke={chartConfig.newCustomers.color}
              strokeWidth={2}
              dot={({ cx, cy, index }) => (
                <Dot
                  key={`dot-${index}`}
                  r={5}
                  cx={cx}
                  cy={cy}
                  fill={chartConfig.newCustomers.color}
                  stroke={chartConfig.newCustomers.color}
                />
              )}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Data is updated periodically
        </div>
        <div className="leading-none text-muted-foreground">
          Showing new customer acquisitions per month
        </div>
      </CardFooter>
    </Card>
  );
};

export default CustomerGrowth;
