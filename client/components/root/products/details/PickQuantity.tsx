'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { IProduct } from '@/types';

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';

type PickQuantityProps = {
  product: IProduct;
  defaultQuantity?: number;
  onQuantityChange?: (
    quantity: number,
    action: 'increment' | 'decrement',
  ) => void;
  children?: (quantity: number) => React.ReactNode;
};

const PickQuantity: React.FC<PickQuantityProps> = ({
  product,
  defaultQuantity,
  onQuantityChange,
  children,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const isOutOfStock = product.stock === 0;

  const handleDecrease = () => {
    if (isOutOfStock) return;
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      onQuantityChange?.(quantity, 'decrement');
    }
  };

  const handleIncrease = () => {
    if (isOutOfStock) return;
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
      onQuantityChange?.(quantity, 'increment');
    }
  };

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
          readOnly
          type="number"
          className="h-[37px] rounded-none text-center"
          value={defaultQuantity || quantity}
          disabled={true}
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
      {children && <div>{children(quantity)}</div>}
    </div>
  );
};

export default PickQuantity;
