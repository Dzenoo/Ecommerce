import React from 'react';

import { ICart } from '@/types';

import ClearCart from './ClearCart';
import CartList from './CartList';

import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

type CartProps = {
  cart: ICart;
};

const Cart: React.FC<CartProps> = ({ cart }) => {
  return (
    <Card className="h-fit shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Your Cart ({cart.items.length})</CardTitle>
          <CardDescription>
            Add items to your cart, and they will appear here.
          </CardDescription>
        </div>
        {cart.items.length > 0 && <ClearCart />}
      </CardHeader>
      <Separator />
      <CardContent>
        <CartList cart={cart} mode="full" />
      </CardContent>
    </Card>
  );
};

export default Cart;
