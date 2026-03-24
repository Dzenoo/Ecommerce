import QueryParamController from '@shared/components/shared/QueryParamController';

import { SelectWrapper } from '@shared/components/ui/form/select';

const SortProducts: React.FC = () => {
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
          className="max-md:w-full"
          value={value}
          onChange={onChange}
          placeholder="Sort by"
          groups={[
            {
              options: [
                {
                  label: 'Newest',
                  value: 'desc',
                },
                {
                  label: 'Oldest',
                  value: 'asc',
                },
              ],
            },
          ]}
        />
      )}
    </QueryParamController>
  );
};

export default SortProducts;
