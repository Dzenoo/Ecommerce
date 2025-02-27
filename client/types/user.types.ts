import { ICart } from './cart.types';
import { IWishlist } from './wishlist.types';
import { IOrder } from './order.types';
import { IAddress } from './address.types';
import { IReview } from './review.types';
import { Role } from './shared.types';

export type UpdateProfileDto = {
  first_name?: string;
  last_name?: string;
};

export interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  cart: ICart | null;
  wishlist: IWishlist | null;
  orders: IOrder[] | [];
  addresses: IAddress[] | [];
  reviews: IReview[] | [];
  role: Role;
  isGoogleAccount: boolean;
}
