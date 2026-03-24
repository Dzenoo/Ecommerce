import { Model } from 'mongoose';

import { User } from '@/models/user/schema/user.schema';
import { Product } from '@/models/product/schema/product.schema';
import { Cart } from '@/models/cart/schema/cart.schema';
import { Order } from '@/models/order/schema/order.schema';
import { Address } from '@/models/address/schema/address.schema';
import { Review } from '@/models/review/schema/review.schema';
import { Wishlist } from '@/models/wishlist/schema/wishlist.schema';
import { Coupon } from '@/models/coupon/schema/coupon.schema';

export interface DatabaseModels {
  user: Model<User>;
  product: Model<Product>;
  cart: Model<Cart>;
  order: Model<Order>;
  address: Model<Address>;
  review: Model<Review>;
  wishlist: Model<Wishlist>;
  coupon: Model<Coupon>;
}

export const DATABASE_MODELS_TOKEN = 'DATABASE_MODELS_TOKEN';
