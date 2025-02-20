import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import { Separator } from '@/components/ui/layout/separator';
import { ICart } from '@/types';
import CartItem from './CartItem';

type CartProps = {
  cart: ICart;
};

const Cart: React.FC<CartProps> = ({ cart }) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Your Cart ({cart.items.length})</CardTitle>
        <CardDescription>
          Add items to your cart, and they will appear here.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-5">
          {['Product', 'Quantity', 'Price', 'Total'].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <h2 className="text-base font-medium">{item}</h2>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-5">
          {cart.items.map((item, i) => (
            <CartItem key={i} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;
