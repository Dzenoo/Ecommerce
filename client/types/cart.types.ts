import { IProduct } from './product.types';
import { IUser } from './user.types';

export type AddItemToCartDto = {
  productId: string;
  quantity: number;
  attributes: Record<string, any>;
};

export interface ICartItem {
  _id: string;
  product: IProduct & string;
  quantity: number;
  attributes: Record<string, any>;
}

export interface ICart {
  _id: string;
  user: IUser;
  items: ICartItem[];
  totalPrice: number;
  isActive: boolean;
  couponApplied: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CartDisplayMode = 'full' | 'summary';
