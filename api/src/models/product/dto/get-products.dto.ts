import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { sanitizeInput } from '@/common/utils';

class RangeFilterDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  readonly min?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  readonly max?: number;
}

export class GetProductsDto {
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
  @IsString()
  @Transform(({ value }) => sanitizeInput(value))
  readonly search?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  readonly sort?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  readonly category?: number;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return value || {};
  })
  readonly attributes?: Record<string, string[]>;

  @IsOptional()
  @ValidateNested()
  @Type(() => RangeFilterDto)
  readonly price?: RangeFilterDto;
}
