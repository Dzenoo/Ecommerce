import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  Length,
} from 'class-validator';
import { sanitizeInput } from '@/common/utils';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Transform(({ value }) => sanitizeInput(value))
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Transform(({ value }) => sanitizeInput(value))
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  @Transform(({ value }) => sanitizeInput(value))
  addressLine1: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value ? sanitizeInput(value) : value))
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform(({ value }) => sanitizeInput(value))
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform(({ value }) => sanitizeInput(value))
  state: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 10)
  @Transform(({ value }) => sanitizeInput(value))
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform(({ value }) => sanitizeInput(value))
  country: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
