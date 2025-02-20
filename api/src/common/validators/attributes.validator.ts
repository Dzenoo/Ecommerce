import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'AttributesValidator', async: false })
export class AttributesValidator implements ValidatorConstraintInterface {
  validate(attributes: any, args: ValidationArguments): boolean {
    if (typeof attributes !== 'object' || attributes === null) {
      return false;
    }

    if (!('size' in attributes) || !('color' in attributes)) {
      return false;
    }

    for (const key of ['size', 'color']) {
      if (!attributes[key] || this.isEmptyValue(attributes[key])) {
        return false;
      }
    }

    for (const key in attributes) {
      if (!Object.prototype.hasOwnProperty.call(attributes, key)) continue;

      const value = attributes[key];
      if (this.isEmptyValue(value)) return false;
    }

    return true;
  }

  private isEmptyValue(value: any): boolean {
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value))
      return (
        value.length === 0 ||
        value.some(
          (item) => typeof item !== 'string' || item.trim().length === 0,
        )
      );
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be an object that includes non-empty "size" and "color" properties, and any other attributes must not be empty.`;
  }
}
