import React from 'react';
import { ShoppingBag } from 'lucide-react';

import { IProduct } from '@/types';

import { Button } from '@/components/ui/buttons/button';

type AddToCartProps = React.HTMLAttributes<HTMLButtonElement> & {
  product: IProduct;
};

const AddToCart: React.FC<AddToCartProps> = ({ product, ...rest }) => {
  return (
    <Button type="button" variant="default" {...rest}>
      <ShoppingBag /> Dodaj u korpu
    </Button>
  );
};

export default AddToCart;
