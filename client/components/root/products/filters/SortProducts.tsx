import QueryParamController from '@/components/shared/QueryParamController';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';

const SortProducts: React.FC = () => {
  return (
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
          <SelectTrigger className="w-[180px] max-md:w-full">
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

export default SortProducts;
