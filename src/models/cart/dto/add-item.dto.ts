import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class AddItemDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  quantity: number;
}
