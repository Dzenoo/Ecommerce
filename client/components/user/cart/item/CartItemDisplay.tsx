import React from 'react';
import { Trash } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { CartDisplayMode, ICartItem } from '@/types';
import { getCategory } from '@/lib/utils';
import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import {
  CartMutationType,
  useCartMutation,
} from '@/hooks/mutations/useCart.mutation';
import PickQuantity from '@/components/root/products/details/PickQuantity';

import { Button } from '@/components/ui/buttons/button';

type CartItemConfig = {
  showQuantity: boolean;
  showPrice: boolean;
  showTotal: boolean;
  showRemove: boolean;
  imageSize: { width: number; height: number };
  showAttributes: boolean;
};

export const displayConfigs: Record<CartDisplayMode, CartItemConfig> = {
  full: {
    showQuantity: true,
    showPrice: true,
    showTotal: true,
    showRemove: true,
    imageSize: { width: 120, height: 120 },
    showAttributes: true,
  },
  summary: {
    showQuantity: false,
    showPrice: true,
    showTotal: true,
    showRemove: false,
    imageSize: { width: 80, height: 80 },
    showAttributes: false,
  },
};

type CartItemDisplayProps = {
  item: ICartItem;
  config: CartItemConfig;
};

const CartItemDisplay: React.FC<CartItemDisplayProps> = ({ item, config }) => {
  const { toast } = useToast();

  const category = getCategory('id', item.product.category);
  const total = item.product.price * item.quantity;

  const mutation = useCartMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: 'Success',
        description: response.message,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const handleQuantityChange = (action: 'increment' | 'decrement') => {
    return mutation.mutateAsync({
      type: CartMutationType.UPDATE,
      data: { action },
      itemId: item._id,
    });
  };

  const handleRemoveItem = () => {
    return mutation.mutateAsync({
      type: CartMutationType.REMOVE,
      itemId: item._id,
    });
  };

  return (
    <div
      className="grid items-center gap-5"
      style={{
        gridTemplateColumns: config.showRemove
          ? '2fr 1fr 1fr 1fr auto'
          : '2fr 1fr 1fr',
      }}
    >
      <div className="flex items-center gap-4">
        <div>
          <Link
            href={`/products/${category?.name.toLowerCase()}/${item.product._id}`}
          >
            <Image
              className="border"
              src={item.product.images[0]}
              alt={item.product.name}
              width={config.imageSize.width}
              height={config.imageSize.height}
            />
          </Link>
        </div>
        <div className="space-y-1.5 text-sm">
          <h2 className="font-medium">{item.product.name}</h2>
          {config.showAttributes &&
            Object.entries(item.attributes).map(([key, value], i) => (
              <div key={i} className="flex items-center gap-2 capitalize">
                <span>{key}: </span>
                <span className="font-bold">{value}</span>
              </div>
            ))}
        </div>
      </div>

      {config.showQuantity && (
        <div>
          <PickQuantity
            product={item.product}
            defaultQuantity={item.quantity}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      )}

      {config.showPrice && (
        <div className="col-span-1">
          <p className="text-sm">{item.product.price} $</p>
        </div>
      )}

      {config.showTotal && (
        <div>
          <p className="text-sm font-bold">{total} $</p>
        </div>
      )}

      {config.showRemove && (
        <div>
          <Button onClick={handleRemoveItem} variant="outline">
            <Trash color="#FF0000" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartItemDisplay;
