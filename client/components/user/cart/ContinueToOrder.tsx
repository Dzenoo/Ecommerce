import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import { Separator } from '@/components/ui/layout/separator';

type ContinueToOrderProps = {};

const ContinueToOrder: React.FC<ContinueToOrderProps> = () => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Continue Order</CardTitle>
        <CardDescription>
          Apply possible coupons and continue to order.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent></CardContent>
    </Card>
  );
};

export default ContinueToOrder;
