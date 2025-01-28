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
