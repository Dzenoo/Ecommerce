import React from 'react';

import QueryParamController from '@/components/shared/QueryParamController';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';

const FilterReviewsProfile = () => {
  return (
    <QueryParamController<string>
      paramKey="sort"
      transform={{
        decode: (value: string | string[]) =>
          Array.isArray(value) ? value[0] || '' : value || '',
        encode: (value) => value,
      }}
    >
      {({ value, onChange }) => (
        <Select onValueChange={onChange} value={value || undefined}>
          <SelectTrigger className="w-[180px] max-sm:w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      )}
    </QueryParamController>
  );
};

export default FilterReviewsProfile;
