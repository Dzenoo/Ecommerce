'use client';

import { SORT_OPTIONS } from '@/constants';
import QueryParamController from '@/components/shared/QueryParamController';

import { Button } from '@/components/ui/buttons/button';
import { SelectWrapper } from '@/components/ui/form/select';

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
    <div className="flex items-center justify-between gap-5 max-md:flex-col max-md:items-start">
      <div className="flex w-full items-center gap-2 max-md:flex-col max-md:items-start">
        {OrdersFilters.map((filter) => (
          <div key={filter.id} className="max-md:w-full">
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
                  className="max-md:w-full"
                >
                  {filter.status}
                </Button>
              )}
            </QueryParamController>
          </div>
        ))}
      </div>
      <QueryParamController<string>
        paramKey="sort"
        transform={{
          decode: (value: string | string[]) =>
            Array.isArray(value) ? value[0] || '' : value || '',
          encode: (value) => value,
        }}
      >
        {({ value, onChange }) => (
          <SelectWrapper
            className="max-md:w-full"
            value={value}
            onChange={onChange}
            placeholder="Sort by"
            groups={[
              {
                options: SORT_OPTIONS,
              },
            ]}
          />
        )}
      </QueryParamController>
    </div>
  );
};

export default FilterOrdersHistory;
