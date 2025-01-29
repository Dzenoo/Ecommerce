import { IProduct } from './product.types';
import { IUser } from './user.types';

export type AddItemToCartDto = {
  productId: string;
  quantity: number;
};

export interface ICart {
  _id: string;
  user: IUser;
  items: {
    product: IProduct | string;
    quantity: number;
  }[];
  totalPrice: number;
  isActive: boolean;
  couponApplied: string;
  createdAt: Date;
  updatedAt: Date;
}
