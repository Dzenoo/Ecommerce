import QueryParamController from '@/components/shared/QueryParamController';

import { Input } from '@/components/ui/form/input';

export const SearchInput: React.FC = () => (
  <QueryParamController<string> paramKey="search">
    {({ value, onChange }) => (
      <Input
        showSearchIcon
        placeholder="Enter concept to search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </QueryParamController>
);
