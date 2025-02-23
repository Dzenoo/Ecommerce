'use client';

import React from 'react';

import { CartQueryType, useCartQuery } from '@/hooks/queries/useCart.query';
import NotFound from '@/components/shared/NotFound';
import CartOrderDetails from '@/components/user/cart/CartOrderDetails';
import Checkout from '@/components/user/cart/checkout/Checkout';

const CheckoutPage = () => {
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

  const isEmpty = data.cart.items.length === 0;

  return (
    <section className="grid grid-cols-[2.5fr,1fr] gap-5 pt-5">
      <Checkout />
      <CartOrderDetails showApplyCoupon showFooter={false} cart={data.cart} />
    </section>
  );
};

export default CheckoutPage;
