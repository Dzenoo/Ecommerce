import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
class IsCouponDateValid implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    const expirationDate = new Date(value);
    const now = new Date();

    if (expirationDate < now) {
      return false;
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Expiration date must be in the future';
  }
}

@ValidatorConstraint({ name: 'IsDiscountValueValid', async: false })
class IsDiscountValueValid implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments): boolean {
    const object = args.object as CreateCouponDto;
    if (object.discountType === 'percentage') {
      return value >= 0 && value <= 100;
    }
    if (object.discountType === 'fixed') {
      return value >= 1 && value <= 1000;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as CreateCouponDto;
    if (object.discountType === 'percentage') {
      return 'Percentage discount must be between 0 and 100';
    }
    if (object.discountType === 'fixed') {
      return 'Fixed discount must be between 1 and 1000';
    }
    return 'Invalid discount value';
  }
}

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(5)
  code: string;

  @IsEnum(['percentage', 'fixed'])
  @IsNotEmpty()
  discountType: 'percentage' | 'fixed';

  @IsNumber()
  @IsPositive()
  @Validate(IsDiscountValueValid)
  discountValue: number;

  @IsDateString()
  @IsNotEmpty()
  @Validate(IsCouponDateValid)
  expirationDate: string;

  @IsNumber()
  @IsOptional()
  maxUsage?: number;

  @IsNumber()
  @IsOptional()
  minPurchaseAmount?: number;
}
