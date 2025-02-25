import { IProduct } from './product.types';
import { IUser } from './user.types';

export type CreateReviewDto = {
  rating: number;
  comment: string;
};

export type GetReviewsDto = {
  page?: number;
  limit?: number;
  sort?: string;
};

export interface IReview {
  _id: string;
  user: IUser & string;
  product: IProduct | string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
