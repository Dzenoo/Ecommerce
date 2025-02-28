'use client';

import React from 'react';

import QueryParamController from '@/components/shared/QueryParamController';

import { Button } from '@/components/ui/buttons/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';

const FilterOrdersHistory: React.FC = () => {
  const OrdersFilters = [
    {
      id: 1,
      status: 'Pending',
    },
    {
      id: 2,
      status: 'Processing',
    },
    {
      id: 3,
      status: 'Shipped',
    },
    {
      id: 4,
      status: 'Delivered',
    },
    {
      id: 5,
      status: 'Cancelled',
    },
  ];

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center space-x-2">
        {OrdersFilters.map((filter) => (
          <div key={filter.id}>
            <QueryParamController<string>
              paramKey="status"
              transform={{
                decode: (value) =>
                  Array.isArray(value) ? value[0] || '' : value || '',
                encode: (value) => value,
              }}
            >
              {({ onChange, value }) => (
                <Button
                  variant={value === filter.status ? 'default' : 'outline'}
                  onClick={() => onChange(filter.status)}
                >
                  {filter.status}
                </Button>
              )}
            </QueryParamController>
          </div>
        ))}
      </div>
      <div>
        <QueryParamController<string>
          paramKey="sort"
          defaultValue="desc"
          transform={{
            decode: (value: string | string[]) =>
              Array.isArray(value) ? value[0] || '' : value || '',
            encode: (value) => value,
          }}
        >
          {({ value, onChange }) => (
            <Select onValueChange={onChange} value={value || undefined}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          )}
        </QueryParamController>
      </div>
    </div>
  );
};

export default FilterOrdersHistory;
