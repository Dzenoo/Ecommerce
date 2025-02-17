'use client';

import React, { useState } from 'react';

import { ListFilter } from 'lucide-react';

import { useMediaQuery } from '@/hooks/core/useMediaQuery.hook';
import { Category, CategoryField as CategoryFieldType } from '@/types';
import QueryParamController from '@/components/shared/QueryParamController';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';
import { MultiSelect } from '@/components/ui/form/multi-select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/layout/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';

type FilterProductsProps = {
  selectedCategory: Category;
};

const FilterProducts: React.FC<FilterProductsProps> = ({
  selectedCategory,
}) => {
  const isXL = useMediaQuery('(min-width: 1280px)');
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="hidden xl:block">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter products by their attributes.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-5">
            {selectedCategory?.fields?.map((f, i) => (
              <CategoryField key={i} field={f} />
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="xl:hidden">
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2"
        >
          <ListFilter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        {!isXL && (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>
                  Filter seekers by skills to find the best candidates.
                </DrawerDescription>
              </DrawerHeader>
              <div className="hide-scrollbar mt-4 h-96 space-y-6 overflow-auto p-5">
                {selectedCategory?.fields?.map((f, i) => (
                  <CategoryField key={i} field={f} />
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
};

const CategoryField = ({ field }: { field: CategoryFieldType }) => {
  switch (field.type) {
    case 'multi': {
      const options =
        field.options?.map((option) =>
          typeof option === 'string'
            ? { label: option, value: option }
            : option,
        ) ?? [];

      return (
        <QueryParamController<string[]>
          paramKey={field.name}
          defaultValue={[]}
          transform={{
            decode: (value) =>
              Array.isArray(value) ? value : value ? [value] : [],
            encode: (value) => value,
          }}
        >
          {({ value, onChange }) => {
            return (
              <div className="space-y-4">
                <div>
                  <div>
                    <label className="text-sm font-medium">{field.label}</label>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {field?.description ?? ''}
                    </p>
                  </div>
                </div>
                <MultiSelect
                  options={options}
                  defaultValue={value}
                  onValueChange={onChange}
                  placeholder={field.placeholder ?? 'Select options'}
                  variant="inverted"
                  maxCount={5}
                />
              </div>
            );
          }}
        </QueryParamController>
      );
    }

    case 'select': {
      return (
        <QueryParamController<string>
          paramKey={field.name}
          defaultValue=""
          transform={{
            decode: (value: string | string[]) =>
              Array.isArray(value) ? value[0] || '' : value || '',
            encode: (value) => value,
          }}
        >
          {({ value, onChange }) => (
            <div className="space-y-4">
              <div>
                <div>
                  <label className="text-sm font-medium">{field.label}</label>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {field?.description ?? ''}
                  </p>
                </div>
              </div>
              <Select value={value || undefined} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={field.placeholder ?? 'Select Options'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) =>
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
            </div>
          )}
        </QueryParamController>
      );
    }

    default: {
      return null;
    }
  }
};

export default FilterProducts;
