import { CreateAddressDto, IAddress } from './address.types';
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
  addressId?: string;
  address?: Omit<CreateAddressDto, 'isDefault'>;
};

export type UpdateOrderDto = {
  status?: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
};

export interface IOrder {
  _id: string;
  user: IUser & string;
  items: {
    _id: string;
    product: IProduct & string;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  address: IAddress & string;
  createdAt: Date;
  updatedAt: Date;
}
