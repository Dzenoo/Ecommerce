import QueryParamController from '@/components/shared/QueryParamController';

import { SelectWrapper } from '@/components/ui/form/select';

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
                  label: 'desc',
                  value: 'Descending',
                },
                {
                  label: 'asc',
                  value: 'Ascending',
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
