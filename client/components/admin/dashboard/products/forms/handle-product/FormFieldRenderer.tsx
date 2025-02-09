import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';

import { CategoryField } from '@/types';

import { MultiSelect } from '@/components/ui/form/multi-select';
import { Input } from '@/components/ui/form/input';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';

type FormFieldRendererProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  fieldConfig: CategoryField;
};

const FormFieldRenderer = <T extends FieldValues>({
  control,
  name,
  fieldConfig,
}: FormFieldRendererProps<T>) => (
  <Controller
    control={control}
    name={name}
    defaultValue={fieldConfig.defaultValue as any}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{fieldConfig.label || fieldConfig.name}</FormLabel>
        <FormControl>{renderComponent(fieldConfig, field)}</FormControl>
        {fieldConfig.description && (
          <FormDescription>{fieldConfig.description}</FormDescription>
        )}
        <FormMessage />
      </FormItem>
    )}
  />
);

const renderComponent = (fieldConfig: CategoryField, field: any) => {
  switch (fieldConfig.type) {
    case 'text': {
      return (
        <Input
          type={fieldConfig.type}
          placeholder={fieldConfig.placeholder}
          value={field.value ?? ''}
          onChange={(e) => field.onChange(e.target.value)}
        />
      );
    }

    case 'select': {
      return (
        <Select
          onValueChange={field.onChange}
          value={field.value?.toString() ?? ''}
          defaultValue={fieldConfig.defaultValue?.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${fieldConfig.label}`} />
          </SelectTrigger>
          <SelectContent>
            {fieldConfig.options?.map((option) =>
              typeof option === 'string' ? (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ) : (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      );
    }

    case 'multi': {
      const options =
        fieldConfig.options?.map((option) =>
          typeof option === 'string'
            ? { label: option, value: option }
            : option,
        ) ?? [];

      return (
        <MultiSelect
          options={options}
          onValueChange={field.onChange}
          placeholder={fieldConfig.placeholder}
          variant="inverted"
          maxCount={3}
        />
      );
    }

    default: {
      return null;
    }
  }
};

export default FormFieldRenderer;
