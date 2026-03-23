import { IProduct } from './product.types';
import { IUser } from './user.types';

export type GetWishlistDto = {
  page?: number;
  limit?: number;
};

export interface IWishlist {
  _id: string;
  user: IUser | string;
  products: IProduct[] & string[];
  createdAt: Date;
  updatedAt: Date;
}
