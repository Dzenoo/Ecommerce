'use client';

import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from 'recharts';

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
import { useMediaQuery } from '@/hooks/core/useMediaQuery.hook';

type OrdersByStatusProps = {
  data: { id: string; status: string }[];
};

const chartConfig = {
  Pending: {
    label: 'Pending',
    color: '#eab308',
  },
  Processing: {
    label: 'Processing',
    color: '#f97316',
  },
  Shipped: {
    label: 'Shipped',
    color: '#3b82f6',
  },
  Delivered: {
    label: 'Delivered',
    color: '#22c55e',
  },
  Cancelled: {
    label: 'Cancelled',
    color: '#ef4444',
  },
} satisfies ChartConfig;

const OrdersByStatus: React.FC<OrdersByStatusProps> = ({ data }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

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
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Legend />
              <Pie
                data={pieChartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={isDesktop ? 100 : 60}
                outerRadius={isDesktop ? 130 : 80}
                paddingAngle={4}
                label
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
          </ResponsiveContainer>
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
