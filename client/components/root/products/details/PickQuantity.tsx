'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { IProduct } from '@/types';

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';

type PickQuantityProps = {
  product: IProduct;
  children: (quantity: number) => React.ReactNode;
};

const PickQuantity: React.FC<PickQuantityProps> = ({ product, children }) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch">
        <Button
          onClick={handleDecrease}
          className="rounded-none"
          disabled={isOutOfStock}
        >
          <Minus />
        </Button>
        <Input
          type="number"
          className="h-[37px] rounded-none text-center"
          max={!isOutOfStock ? product.stock : 0}
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          disabled={isOutOfStock}
          placeholder="Quantity"
        />
        <Button
          onClick={handleIncrease}
          className="rounded-none"
          disabled={isOutOfStock}
        >
          <Plus />
        </Button>
      </div>
      <div>{children(quantity)}</div>
    </div>
  );
};

export default PickQuantity;
