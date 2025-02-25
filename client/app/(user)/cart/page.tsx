'use client';

import React from 'react';

import { CartQueryType, useCartQuery } from '@/hooks/queries/useCart.query';
import Cart from '@/components/user/cart/Cart';
import NotFound from '@/components/shared/NotFound';
import CartOrderDetails from '@/components/user/cart/CartOrderDetails';
import LoadingCart from '@/components/shared/loading/LoadingCart';

const CartPage = () => {
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

  const isEmpty = data.cart.items.length === 0;

  return (
    <section
      className={`grid gap-5 pt-5 ${isEmpty ? 'grid-cols-1' : 'grid-cols-[2.5fr,1fr]'}`}
    >
      <Cart cart={data.cart} />
      {!isEmpty && <CartOrderDetails type="cart" showFooter cart={data.cart} />}
    </section>
  );
};

export default CartPage;
