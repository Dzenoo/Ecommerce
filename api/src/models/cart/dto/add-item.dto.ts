import { AttributesValidator } from '@/common/validators/attributes.validator';
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
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @Validate(AttributesValidator, {
    message: 'Please select color and size at least for the product',
  })
  attributes: Record<string, any>;
}
