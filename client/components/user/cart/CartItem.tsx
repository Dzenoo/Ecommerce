import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash } from 'lucide-react';

import { ICartItem } from '@/types';
import { getCategory } from '@/lib/utils';
import PickQuantity from '@/components/root/products/details/PickQuantity';
import {
  CartMutationType,
  useCartMutation,
} from '@/hooks/mutations/useCart.mutation';
import { useToast } from '@/hooks/core/use-toast';
import { queryClient } from '@/context/react-query-client';

import { Button } from '@/components/ui/buttons/button';

type CartItemProps = {
  item: ICartItem;
};

const CartItem: React.FC<CartItemProps> = ({ item }) => {
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
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-5">
      <div className="flex items-center gap-4">
        <div>
          <Link
            href={`/products/${category?.name.toLowerCase()}/${item.product._id}`}
          >
            <Image
              className="border"
              src={item.product.images[0]}
              alt={item.product.name}
              width={120}
              height={120}
            />
          </Link>
        </div>
        <div className="space-y-1.5 text-sm">
          <h2 className="font-medium">{item.product.name}</h2>
          {Object.entries(item.attributes).map(([key, value], i) => (
            <div key={i} className="flex items-center gap-2 capitalize">
              <span>{key}: </span>
              <span className="font-bold">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <PickQuantity
          product={item.product}
          defaultQuantity={item.quantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
      <div className="col-span-1">
        <p className="text-sm">{item.product.price} DIN</p>
      </div>
      <div>
        <p className="text-sm font-bold">{total} DIN</p>
      </div>
      <div>
        <Button onClick={handleRemoveItem} variant="outline">
          <Trash color="#FF0000" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
