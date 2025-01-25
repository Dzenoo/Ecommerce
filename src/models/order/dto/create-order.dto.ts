import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Address } from '@/models/address/schema/address.schema';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  cartId: string;

  @IsMongoId()
  @IsNotEmpty()
  shippingAddress: string;

  @IsOptional()
  manualShippingAddress?: Address;
}
