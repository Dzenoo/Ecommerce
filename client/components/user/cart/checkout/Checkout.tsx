'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

import { CartQueryType, useCartQuery } from '@/hooks/queries/useCart.query';
import NotFound from '@/components/shared/NotFound';
import CartOrderDetails from '@/components/user/cart/CartOrderDetails';
import Empty from '@/helpers/Empty';
import LoadingCheckout from '@/components/shared/loading/LoadingCheckout';
import SelectAddress from './SelectAddress';
import CheckoutForm from './forms/CheckoutForm';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

const Checkout: React.FC = () => {
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

  const cart = data.cart;
  const isEmpty = cart.items.length === 0;

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
    <section className="grid grid-cols-[2.5fr,1fr] gap-5 pt-5 max-lg:grid-cols-1">
      <Card className="h-fit shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-5">
          <div className="space-y-1.5">
            <CardTitle>Checkout</CardTitle>
            <CardDescription>
              Enter your shipping details to complete your order.
            </CardDescription>
          </div>
          <Link href="/cart">
            <Button>Back to cart</Button>
          </Link>
        </CardHeader>
        <Separator />
        <CardContent>
          <SelectAddress>
            {(type) => <CheckoutForm cartId={cart._id} type={type} />}
          </SelectAddress>
        </CardContent>
      </Card>
      <CartOrderDetails
        showSummary
        showApplyCoupon
        showFooter
        type="checkout"
        cart={cart}
      />
    </section>
  );
};

export default Checkout;
