'use client';

import React, { useState } from 'react';

import { ListFilter } from 'lucide-react';

import { useMediaQuery } from '@/hooks/core/useMediaQuery.hook';
import { Category, CategoryField as CategoryFieldType } from '@/types';
import QueryParamController from '@/components/shared/QueryParamController';

import { Input } from '@/components/ui/form/input';
import { Button } from '@/components/ui/buttons/button';
import { Checkbox } from '@/components/ui/buttons/checkbox';
import { MultiSelect } from '@/components/ui/form/multi-select';
import { Card, CardContent } from '@/components/ui/layout/card';
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
  SelectGroup,
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
              <div className="hide-scrollbar mt-4 h-96 space-y-6 overflow-auto p-5"></div>
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
              <MultiSelect
                options={options}
                defaultValue={value}
                onValueChange={onChange}
                placeholder={field.placeholder ?? 'Select options'}
                variant="inverted"
                maxCount={5}
              />
            );
          }}
        </QueryParamController>
      );
    }

    case 'select': {
      return (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Size"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="xs">XS</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }

    default: {
      return null;
    }
  }
};

export default FilterProducts;
