import { IUser } from './user.types';

export type CreateAddressDto = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

export type GetAddressesDto = {
  page?: number;
  limit?: number;
};

export interface IAddress extends CreateAddressDto {
  _id: string;
  user: IUser | string;
  createdAt: Date;
  updatedAt: Date;
}
