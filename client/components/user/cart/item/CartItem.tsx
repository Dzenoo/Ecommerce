import { CartDisplayMode, ICartItem } from '@/types';
import CartItemDisplay, { displayConfigs } from './CartItemDisplay';

type CartItemProps = {
  item: ICartItem;
  mode: CartDisplayMode;
};

const CartItem: React.FC<CartItemProps> = ({ item, mode }) => {
  const config = displayConfigs[mode];

  return <CartItemDisplay item={item} config={config} />;
};

export default CartItem;
