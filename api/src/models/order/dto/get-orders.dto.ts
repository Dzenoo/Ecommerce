import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class GetOrdersDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => (value ? Number(value) : 1))
  readonly page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => (value ? Number(value) : 10))
  readonly limit?: number = 10;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Transform(({ value }) => (value === '' ? undefined : value))
  readonly sort?: 'asc' | 'desc';

  @IsOptional()
  @IsEnum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
  @Transform(({ value }) => (value === '' ? undefined : value))
  readonly status?: string;
}
