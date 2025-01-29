export type CreateProductDto = {
  name: string;
  price: number;
  description: string;
  stock?: number;
  discount?: number;
  category: string;
  images: string[];
  attributes: Record<string, any>;
};

export type GetProductsDto = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  category?: string;
  attributes?: string[];
  price?: { min: number; max: number };
};
