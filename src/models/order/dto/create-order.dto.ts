import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '@/models/product/schema/product.schema';
import { Address } from '@/models/address/schema/address.schema';

export class OrderItemDto {
  @IsMongoId()
  product: Product;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  price: number;
}

export class CreateOrderDto {
  @IsMongoId()
  user: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(0.01)
  totalPrice: number;

  @IsMongoId()
  shippingAddress: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  manualShippingAddress?: Address;
}
