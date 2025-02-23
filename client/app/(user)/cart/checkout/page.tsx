import React from 'react';

import Checkout from '@/components/user/cart/checkout/Checkout';
import CartOrderDetails from '@/components/user/cart/CartOrderDetails';

const CheckoutPage = () => {
  return (
    <section className="grid grid-cols-2 gap-5 pt-5">
      <Checkout />
      {/* <CartOrderDetails showApplyCoupon /> */}
    </section>
  );
};

export default CheckoutPage;
