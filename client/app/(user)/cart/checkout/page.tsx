'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

import { CartQueryType, useCartQuery } from '@/hooks/queries/useCart.query';
import NotFound from '@/components/shared/NotFound';
import CartOrderDetails from '@/components/user/cart/CartOrderDetails';
import Checkout from '@/components/user/cart/checkout/Checkout';
import Empty from '@/helpers/Empty';
import LoadingCheckout from '@/components/shared/loading/LoadingCheckout';

const CheckoutPage = () => {
  const { data, isLoading } = useCartQuery({
    type: CartQueryType.GET_CART,
  });

  if (isLoading) {
    return (
      <div className="pt-5">
        <LoadingCheckout />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-5">
        <NotFound />
      </div>
    );
  }

  const isEmpty = data.cart.items.length === 0;

  if (isEmpty)
    return (
      <div className="pt-52">
        <Empty
          title="No Products In Cart"
          description="Your cart is empty. Add products to your cart to see them here."
          icon={<ShoppingBag size={25} className="mb-4" />}
        />
      </div>
    );

  return (
    <section className="grid grid-cols-[2.5fr,1fr] gap-5 pt-5">
      <Checkout cart={data.cart} />
      <CartOrderDetails
        showSummary
        showApplyCoupon
        showFooter
        type="checkout"
        cart={data.cart}
      />
    </section>
  );
};

export default CheckoutPage;
