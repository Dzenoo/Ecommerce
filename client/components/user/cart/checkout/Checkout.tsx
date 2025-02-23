import React from 'react';
import Link from 'next/link';

import { ICart } from '@/types';

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
import FieldGroup from '@/helpers/FieldGroup';

type CheckoutProps = {};

const Checkout: React.FC<CheckoutProps> = ({}) => {
  return (
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
          {(type) =>
            type === 'auto' ? (
              <div className="pt-10">Auto</div>
            ) : type === 'manual' ? (
              <div className="flex flex-col gap-10 pt-10">
                <FieldGroup
                  title="Shipping Address and Payment"
                  value="Enter your shipping address and payment details"
                  customStyles={{ h1: 'text-xl font-medium', p: 'text-sm' }}
                />
                <CheckoutForm />
              </div>
            ) : null
          }
        </SelectAddress>
      </CardContent>
    </Card>
  );
};

export default Checkout;
