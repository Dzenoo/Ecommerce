import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  Length,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  addressLine1: string;

  @IsString()
  @IsOptional()
  @Length(5, 100)
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  state: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 10)
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  country: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
