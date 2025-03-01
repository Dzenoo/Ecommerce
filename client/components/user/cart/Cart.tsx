'use client';

import React from 'react';

import { CartQueryType, useCartQuery } from '@/hooks/queries/useCart.query';
import ClearCart from './ClearCart';
import CartList from './CartList';
import NotFound from '@/components/shared/NotFound';
import LoadingCart from '@/components/shared/loading/LoadingCart';
import CartOrderDetails from './CartOrderDetails';

import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

const Cart: React.FC = () => {
  const { data, isLoading } = useCartQuery({
    type: CartQueryType.GET_CART,
  });

  if (isLoading) {
    return <LoadingCart />;
  }

  if (!data) {
    return (
      <div className="pt-5">
        <NotFound />
      </div>
    );
  }

  const cart = data.cart;
  const isEmpty = cart.items.length === 0;

  return (
    <div
      className={`grid gap-5${isEmpty ? 'grid-cols-1' : 'grid-cols-[2.5fr,1fr]'}`}
    >
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
      {!isEmpty && <CartOrderDetails type="cart" showFooter cart={cart} />}
    </div>
  );
};

export default Cart;
