import { SORT_OPTIONS } from '@shared/constants';
import QueryParamController from '@shared/components/shared/QueryParamController';

import { SelectWrapper } from '@shared/components/ui/form/select';

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
