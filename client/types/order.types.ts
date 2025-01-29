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
