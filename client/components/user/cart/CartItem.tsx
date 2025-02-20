import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ICartItem } from '@/types';
import { getCategory } from '@/lib/utils';
import PickQuantity from '@/components/root/products/details/PickQuantity';
import {
  CartMutationType,
  useCartMutation,
} from '@/hooks/mutations/useCart.mutation';
import { useToast } from '@/hooks/core/use-toast';
import { queryClient } from '@/context/react-query-client';

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
        description: response.message || 'Quantity Updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const handleQuantityChange = (
    quantity: number,
    action: 'increment' | 'decrement',
  ) => {
    return mutation.mutateAsync({
      type: CartMutationType.UPDATE,
      data: { quantity, action },
      productId: item._id,
    });
  };

  return (
    <div className="grid grid-cols-4 items-center gap-5">
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
        <p className="text-sm">{item.product.price} DIN</p>
      </div>
      <div>
        <PickQuantity
          product={item.product}
          defaultQuantity={item.quantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
      <div>
        <p className="text-sm font-bold">{total} DIN</p>
      </div>
    </div>
  );
};

export default CartItem;
