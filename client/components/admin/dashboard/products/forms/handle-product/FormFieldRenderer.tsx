import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';

import { CategoryField } from '@/types';

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
        <FormControl>
          {fieldConfig.type === 'select' ? (
            <Select
              onValueChange={field.onChange}
              value={field.value?.toString() ?? ''}
              defaultValue={fieldConfig.defaultValue?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${fieldConfig.label}`} />
              </SelectTrigger>
              <SelectContent>
                {fieldConfig.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={fieldConfig.type}
              placeholder={fieldConfig.placeholder}
              value={field.value ?? ''}
              onChange={(e) => {
                if (fieldConfig.type === 'number') {
                  field.onChange(e.target.valueAsNumber);
                } else {
                  field.onChange(e.target.value);
                }
              }}
            />
          )}
        </FormControl>
        {fieldConfig.description && (
          <FormDescription>{fieldConfig.description}</FormDescription>
        )}
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormFieldRenderer;
