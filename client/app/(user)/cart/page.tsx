'use client';

import React from 'react';

import { CartQueryType, useCartQuery } from '@/hooks/queries/useCart.query';
import Cart from '@/components/user/cart/Cart';
import NotFound from '@/components/shared/NotFound';
import ContinueToOrder from '@/components/user/cart/ContinueToOrder';

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
      <ContinueToOrder />
    </section>
  );
};

export default CartPage;
