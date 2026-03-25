'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

type TopSellingProductsProps = {
  data: { product: string; totalQuantity: number }[];
};

const chartConfig = {
  totalQuantity: {
    label: 'Sales',
    color: '#2563eb',
  },
} satisfies ChartConfig;

const TopSellingProducts: React.FC<TopSellingProductsProps> = ({ data }) => {
  let chartData = (data || [])
    .map((item) => ({
      product: item.product || 'Unknown Product',
      totalQuantity: item.totalQuantity || 0,
    }))
    .slice(0, 5);

  if (chartData.length === 0) {
    chartData = [{ product: 'No Sales', totalQuantity: 0 }];
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="totalQuantity"
              fill={chartConfig.totalQuantity.color}
              radius={8}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Data is updated periodically
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total quantity sold by product.
        </div>
      </CardFooter>
    </Card>
  );
};

export default TopSellingProducts;
