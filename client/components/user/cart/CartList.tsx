import React from 'react';
import { ShoppingBag } from 'lucide-react';

import { CartDisplayMode, ICart } from '@/types';
import Empty from '@/helpers/Empty';
import CartItem from './item/CartItem';
import { displayConfigs } from './item/CartItemDisplay';

import { Separator } from '@/components/ui/layout/separator';

type CartListProps = {
  cart: ICart;
  mode: CartDisplayMode;
};

const CartList: React.FC<CartListProps> = ({ cart, mode }) => {
  const config = displayConfigs[mode];

  const headers = ['Product'];

  if (config.showQuantity) headers.push('Quantity');
  if (config.showPrice) headers.push('Price');
  if (config.showTotal) headers.push('Total');
  if (config.showRemove) headers.push('Remove');

  if (cart.items.length === 0)
    return (
      <Empty
        icon={<ShoppingBag size={25} className="mb-4" />}
        title="No Products In Cart"
        description="Your cart is empty. Add products to your cart to see them here."
      />
    );

  return (
    <div className="hide-scrollbar max-h-screen space-y-5 overflow-y-auto">
      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: config.showRemove
            ? '2fr 1fr 1fr 1fr auto'
            : '2fr 1fr 1fr',
        }}
      >
        {headers.map((item, index) => (
          <h2 key={index} className="text-base font-medium">
            {item}
          </h2>
        ))}
      </div>
      <Separator />
      <div className="flex flex-col gap-5">
        {cart.items.map((item, i) => (
          <CartItem key={i} item={item} mode={mode} />
        ))}
      </div>
    </div>
  );
};

export default CartList;
