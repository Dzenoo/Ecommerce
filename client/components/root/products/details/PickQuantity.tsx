'use client';

import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { IProduct } from '@/types';
import { useAuthStore } from '@/store/auth.store';

import { Button } from '@/components/ui/buttons/button';
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
  defaultQuantity = 1,
  onQuantityChange,
  children,
  className,
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(defaultQuantity);
  const isOutOfStock = product.stock === 0;
  const isDecreaseEnabled = isOutOfStock || quantity <= 1;
  const isIncreaseEnabled = isOutOfStock || quantity >= product.stock;

  useEffect(() => {
    setQuantity(defaultQuantity);
  }, [defaultQuantity]);

  if (!isAuthenticated || user?.role === 'admin') {
    return null;
  }

  const handleDecrease = () => {
    if (isDecreaseEnabled) return;
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    onQuantityChange?.('decrement');
  };

  const handleIncrease = () => {
    if (isIncreaseEnabled) return;
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange?.('increment');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch">
        <Button
          size="sm"
          onClick={handleDecrease}
          className="rounded-none rounded-l-md"
          disabled={isDecreaseEnabled}
        >
          <Minus />
        </Button>
        <div
          className={cn(
            'flex w-10 items-center justify-center border text-sm',
            className,
          )}
        >
          {quantity}
        </div>
        <Button
          size="sm"
          onClick={handleIncrease}
          className="rounded-none rounded-r-md"
          disabled={isIncreaseEnabled}
        >
          <Plus />
        </Button>
      </div>
      {children && <div>{children(quantity)}</div>}
    </div>
  );
};

export default PickQuantity;
