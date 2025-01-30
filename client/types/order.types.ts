import { IAddress } from './address.types';
import { IProduct } from './product.types';
import { IUser } from './user.types';

export type GetOrdersDto = {
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
};

export type CreateOrderDto = {
  cartId: string;
  shippingAddress: string;
  manualShippingAddress?: any;
};

export type UpdateOrderDto = {
  status?: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
};

export interface IOrder {
  _id: string;
  user: IUser | string;
  items: {
    product: IProduct | string;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: IAddress | string;
  manualShippingAddress?: IAddress;
  createdAt: Date;
  updatedAt: Date;
}
