import {
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '@/models/address/dto/create-address.dto';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  cartId: string;

  @IsOptional()
  @IsMongoId()
  addressId?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;
}
