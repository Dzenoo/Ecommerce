'use client';

import React from 'react';

import { CartQueryType, useCartQuery } from '@/hooks/queries/useCart.query';
import Cart from '@/components/user/cart/Cart';
import NotFound from '@/components/shared/NotFound';
import CartOrderDetails from '@/components/user/cart/CartOrderDetails';

const CartPage = () => {
  const { data, isLoading } = useCartQuery({
    type: CartQueryType.GET_CART,
  });

  if (isLoading) {
    return <div className="pt-5">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="pt-5">
        <NotFound />
      </div>
    );
  }

  return (
    <section className="grid grid-cols-[2.5fr,1fr] gap-5 pt-5">
      <Cart cart={data.cart} />
      <CartOrderDetails cart={data.cart} />
    </section>
  );
};

export default CartPage;
