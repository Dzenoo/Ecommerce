import React from 'react';

import { ICart } from '@/types';

import CheckoutForm from './forms/CheckoutForm';

import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

type CheckoutProps = {};

const Checkout: React.FC<CheckoutProps> = ({}) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>
          Enter your shipping details to complete your order.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <CheckoutForm />
      </CardContent>
    </Card>
  );
};

export default Checkout;
