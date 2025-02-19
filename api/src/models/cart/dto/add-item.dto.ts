import { AttributesValidator } from '@/models/product/dto/create-product.dto';
import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  Max,
  Min,
  Validate,
} from 'class-validator';

export class AddItemDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  @Max(100)
  @Min(1)
  quantity: number;

  @IsObject()
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  @Validate(AttributesValidator, {
    message:
      'Attributes must be an object where each key has a string or an array of strings as its value.',
  })
  attributes: Record<string, any>;
}
