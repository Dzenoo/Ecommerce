import { useQueryParams } from '@/hooks/core/useQueryParams';
import QueryParamController from '@/components/shared/QueryParamController';

import { Button } from '@/components/ui/buttons/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';

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
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[150px] max-lg:w-full">
                  <SelectValue placeholder="Sort by created date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort orders by</SelectLabel>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[150px] max-lg:w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select by status</SelectLabel>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </QueryParamController>
        </div>
      </div>
    </div>
  );
};

export default FilterDashboardOrders;
