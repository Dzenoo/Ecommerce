import React from 'react';

import { Input } from '@/components/ui/form/input';

export const SearchInput: React.FC<{
  query: string;
  setQuery: (query: string) => void;
}> = ({ query, setQuery }) => (
  <Input
    showSearchIcon
    placeholder="Enter concept to search..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
);
