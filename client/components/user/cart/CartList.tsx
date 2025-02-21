import React from 'react';
import { ShoppingBag } from 'lucide-react';

import { ICart } from '@/types';
import Empty from '@/helpers/Empty';
import CartItem from './CartItem';

import { Separator } from '@/components/ui/layout/separator';

type CartListProps = {
  cart: ICart;
};

const CartList: React.FC<CartListProps> = ({ cart }) => {
  return (
    <div className="hide-scrollbar max-h-screen space-y-4 overflow-y-auto">
      {cart.items.length === 0 && (
        <Empty
          icon={<ShoppingBag size={25} className="mb-4" />}
          title="No Products In Cart"
          description="Your cart is empty. Add products to your cart to see them here."
        />
      )}
      {cart.items.length > 0 && (
        <>
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-5">
            {['Product', 'Quantity', 'Price', 'Total', 'Remove'].map(
              (item, index) => (
                <h2 key={index} className="text-base font-medium">
                  {item}
                </h2>
              ),
            )}
          </div>
          <Separator />
          <div className="flex flex-col gap-5">
            {cart.items.map((item, i) => (
              <CartItem key={i} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CartList;
