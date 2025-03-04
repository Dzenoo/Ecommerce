import { SORT_OPTIONS } from '@/constants';
import QueryParamController from '@/components/shared/QueryParamController';

import { SelectWrapper } from '@/components/ui/form/select';

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
        <SelectWrapper
          className="max-sm:w-full"
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
  );
};

export default FilterReviewsProfile;
