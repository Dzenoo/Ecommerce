import { IReview } from './review.types';

export type CreateProductDto = {
  name: string;
  price: number;
  description: string;
  stock?: number;
  discount?: number;
  category: number;
  images: string[];
  attributes: Record<string, any>;
};

export type GetProductsDto = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  category?: number;
  attributes?: Record<string, string[]>;
  price?: { min: number; max: number };
};

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  discount: number;
  averageRating: number;
  category: number;
  attributes: Record<string, string | string[] | number | number[]>;
  reviews: IReview[] | [];
  createdAt: Date;
  updatedAt: Date;
}
