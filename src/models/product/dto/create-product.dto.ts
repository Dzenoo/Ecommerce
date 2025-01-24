import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { sanitizeInput } from '@/common/utils';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(25)
  @Transform(({ value }) => sanitizeInput(value))
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100000)
  @Transform(({ value }) => Number(value))
  price: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  @Transform(({ value }) => sanitizeInput(value))
  description: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  stock?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  discount?: number;

  @IsMongoId()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeInput(value))
  category: string;

  @IsObject()
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  attributes: Record<string, any>;

  //   @IsObject()
  //   @IsNotEmpty()
  //   @ValidateNested()
  //   @Type(() => AttributeDto) // A separate DTO for attributes
  //   attributes: AttributeDto;
}
