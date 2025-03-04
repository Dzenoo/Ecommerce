'use client';

import QueryParamController from '@/components/shared/QueryParamController';

import { Input } from '@/components/ui/form/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';

const SearchDashboardProducts: React.FC = () => {
  return (
    <div className="flex items-center gap-5 max-lg:flex-col max-lg:items-start">
      <div className="flex-1 basis-7/12 max-lg:w-full max-lg:basis-full">
        <QueryParamController<string> paramKey="search" defaultValue="">
          {({ value, onChange }) => (
            <Input
              type="text"
              placeholder="Search products...."
              value={value !== undefined ? value : ''}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </QueryParamController>
      </div>

      <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
        <QueryParamController<string> paramKey="limit" defaultValue="10">
          {({ value, onChange }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Products per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Products per page</SelectLabel>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </QueryParamController>
      </div>

      <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
        <QueryParamController<string> paramKey="sort" defaultValue="default">
          {({ value, onChange }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort products by</SelectLabel>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </QueryParamController>
      </div>
    </div>
  );
};

export default SearchDashboardProducts;
