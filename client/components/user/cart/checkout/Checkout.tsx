import React from 'react';
import Link from 'next/link';

import { ICart } from '@/types';

import SelectAddress from './SelectAddress';
import CheckoutForm from './forms/CheckoutForm';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

type CheckoutProps = {
  cart: ICart;
};

const Checkout: React.FC<CheckoutProps> = ({ cart }) => {
  return (
    <Card className="h-fit shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-5">
        <div className="space-y-1.5">
          <CardTitle>Checkout</CardTitle>
          <CardDescription>
            Enter your shipping details to complete your order.
          </CardDescription>
        </div>
        <Link href="/cart">
          <Button>Back to cart</Button>
        </Link>
      </CardHeader>
      <Separator />
      <CardContent>
        <SelectAddress>
          {(type) => <CheckoutForm cartId={cart._id} type={type} />}
        </SelectAddress>
      </CardContent>
    </Card>
  );
};

export default Checkout;
