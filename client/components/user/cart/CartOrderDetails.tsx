import React from 'react';
import Link from 'next/link';

import { ICart } from '@/types';
import { getCategory } from '@/lib/utils';
import FieldGroup from '@/helpers/FieldGroup';
import ApplyCouponForm from './checkout/forms/ApplyCouponForm';
import CartList from './CartList';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import { Separator } from '@/components/ui/layout/separator';
import { Button } from '@/components/ui/buttons/button';

type CartOrderDetailsProps = {
  showSummary?: boolean;
  showFooter?: boolean;
  showApplyCoupon?: boolean;
  cart: ICart;
};

const CartOrderDetails: React.FC<CartOrderDetailsProps> = ({
  showSummary = false,
  showFooter = true,
  showApplyCoupon = false,
  cart,
}) => {
  const cartItems = cart.items.map((item) => item.product);
  const productsUrl =
    cartItems.map(
      (i) => `/products/${getCategory('id', i.category)?.name.toLowerCase()}`,
    )[0] || '/';

  return (
    <Card className="h-fit shadow-none">
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
        <CardDescription>
          Continue to checkout to complete your order.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-5">
        {showSummary && <CartList cart={cart} mode="summary" />}
        {showApplyCoupon && <ApplyCouponForm cartId={cart._id} />}
        <FieldGroup
          title="Total Price"
          value={`${cart.totalPrice} DIN`}
          customStyles={{
            div: 'flex flex-row justify-between items-center',
            p: 'font-bold text-black text-sm',
          }}
        />
        <FieldGroup
          title="Delivery"
          value={'Shipping costs are calculated during checkout.'}
          customStyles={{
            div: 'flex flex-row justify-between items-center',
            p: ' text-sm',
          }}
        />
      </CardContent>
      {showFooter && (
        <CardFooter className="flex flex-col space-y-2 pt-0">
          <Link href="/cart/checkout" className="w-full">
            <Button className="w-full">Proceed to checkout</Button>
          </Link>
          <Link href={productsUrl} className="w-full">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default CartOrderDetails;
