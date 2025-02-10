import { CategoryField } from '@/types';

interface FieldConfig extends CategoryField {}

export const validateObject = (
  attributes: Record<string, any>,
  fields: FieldConfig[],
): string[] => {
  const errors: string[] = [];

  fields.forEach((field) => {
    const value = attributes[field.name];

    if (field.required) {
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)
      ) {
        errors.push(`${field.label} is required.`);
        return;
      }
    }

    if (value === undefined || value === null || value === '') {
      return;
    }

    if (field.type === 'select') {
      const isValid = field.options?.some((option) => option.value === value);
      if (!isValid) {
        errors.push(`Invalid selection for ${field.label}.`);
      }
    } else if (field.type === 'multi') {
      if (!Array.isArray(value)) {
        errors.push(`${field.label} must be an array of selections.`);
      } else {
        const invalidSelections = value.filter(
          (v) => !field.options?.some((option) => option.value === v),
        );
        if (invalidSelections.length > 0) {
          errors.push(`Invalid selection(s) for ${field.label}.`);
        }
      }
    } else if (field.type === 'text') {
      if (typeof value !== 'string') {
        errors.push(`${field.label} must be a text value.`);
      }
    }
  });

  return errors;
};
