'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { IProduct } from '@/types';

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';
import { cn } from '@/lib/utils';

type PickQuantityProps = {
  product: IProduct;
  defaultQuantity?: number;
  onQuantityChange?: (action: 'increment' | 'decrement') => void;
  children?: (quantity: number) => React.ReactNode;
  className?: string;
};

const PickQuantity: React.FC<PickQuantityProps> = ({
  product,
  defaultQuantity,
  onQuantityChange,
  children,
  className,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const isOutOfStock = product.stock === 0;

  const handleDecrease = () => {
    if (isOutOfStock) return;
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onQuantityChange?.('decrement');
    }
  };

  const handleIncrease = () => {
    if (isOutOfStock) return;
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
      onQuantityChange?.('increment');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch">
        <Button
          size="sm"
          onClick={handleDecrease}
          className="rounded-none rounded-l-md"
          disabled={isOutOfStock}
        >
          <Minus />
        </Button>
        <div
          className={cn(
            'flex w-10 items-center justify-center border text-sm',
            className,
          )}
        >
          {defaultQuantity ? defaultQuantity : quantity}
        </div>
        <Button
          size="sm"
          onClick={handleIncrease}
          className="rounded-none rounded-r-md"
          disabled={isOutOfStock}
        >
          <Plus />
        </Button>
      </div>
      {children && <div>{children(quantity)}</div>}
    </div>
  );
};

export default PickQuantity;
