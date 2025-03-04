import { useQueryParams } from '@/hooks/core/useQueryParams';
import { SORT_OPTIONS } from '@/constants';
import QueryParamController from '@/components/shared/QueryParamController';

import { Button } from '@/components/ui/buttons/button';
import { SelectWrapper } from '@/components/ui/form/select';

const FilterDashboardOrders: React.FC = () => {
  const { clearAllQueryParams } = useQueryParams();

  return (
    <div className="flex justify-between gap-5 max-lg:flex-col">
      <div className="flex-1 basis-full"></div>
      <div className="flex items-center gap-2 max-lg:flex-col">
        <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
          <Button
            variant="outline"
            onClick={clearAllQueryParams}
            className="max-lg:w-full"
          >
            Clear All Filters
          </Button>
        </div>
        <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
          <QueryParamController<string>
            paramKey="sort"
            transform={{
              decode: (value) =>
                Array.isArray(value) ? value[0] || '' : value || '',
              encode: (value) => value,
            }}
          >
            {({ value, onChange }) => (
              <SelectWrapper
                className="max-lg:w-full"
                value={value}
                onChange={onChange}
                placeholder="Sort by created date"
                groups={[
                  {
                    label: 'Sort orders by',
                    options: SORT_OPTIONS,
                  },
                ]}
              />
            )}
          </QueryParamController>
        </div>
        <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
          <QueryParamController<string>
            paramKey="status"
            transform={{
              decode: (value) =>
                Array.isArray(value) ? value[0] || '' : value || '',
              encode: (value) => value,
            }}
          >
            {({ value, onChange }) => (
              <SelectWrapper
                className="max-lg:w-full"
                value={value}
                onChange={onChange}
                placeholder="Status"
                groups={[
                  {
                    label: 'Change status',
                    options: [
                      {
                        label: 'Pending',
                        value: 'Pending',
                      },
                      {
                        label: 'Processing',
                        value: 'Processing',
                      },
                      {
                        label: 'Shipped',
                        value: 'Shipped',
                      },
                      {
                        label: 'Delivered',
                        value: 'Delivered',
                      },
                      {
                        label: 'Cancelled',
                        value: 'Cancelled',
                      },
                    ],
                  },
                ]}
              />
            )}
          </QueryParamController>
        </div>
      </div>
    </div>
  );
};

export default FilterDashboardOrders;
