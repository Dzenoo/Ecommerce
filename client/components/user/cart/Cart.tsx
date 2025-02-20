import React from 'react';
import { ShoppingBag } from 'lucide-react';

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
import Empty from '@/helpers/Empty';

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
        {cart.items.length === 0 && (
          <Empty
            icon={<ShoppingBag size={50} className="mb-4" />}
            title="No Products In Cart"
            description="Your cart is empty. Add products to your cart to see them here."
          />
        )}
        {cart.items.length > 0 && (
          <>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-5">
              {['Product', 'Quantity', 'Price', 'Total', 'Remove'].map(
                (item, index) => (
                  <h2 key={index} className="text-base font-medium">
                    {item}
                  </h2>
                ),
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-5">
              {cart.items.map((item, i) => (
                <CartItem key={i} item={item} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Cart;
