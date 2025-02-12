import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { sanitizeInput } from '@/common/utils';

@ValidatorConstraint({ name: 'AttributesValidator', async: false })
export class AttributesValidator implements ValidatorConstraintInterface {
  validate(attributes: any, args: ValidationArguments): boolean {
    if (typeof attributes !== 'object' || attributes === null) {
      return false;
    }

    for (const key in attributes) {
      if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
        continue;
      }

      const value = attributes[key];

      if (typeof value === 'string') {
        if (value.trim().length === 0) {
          return false;
        }
        continue;
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return false;
        }
        if (
          !value.every(
            (item) => typeof item === 'string' && item.trim().length > 0,
          )
        ) {
          return false;
        }
        continue;
      }

      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be an object where each key has either a non-empty string or a non-empty array of non-empty strings as its value.`;
  }
}

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

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  category: number;

  @IsObject()
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  @Validate(AttributesValidator, {
    message:
      'Attributes must be an object where each key has a string or an array of strings as its value.',
  })
  attributes: Record<string, any>;
}
