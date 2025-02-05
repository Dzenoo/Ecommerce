import React from 'react';

import { useMounted } from '@/hooks/core/useMounted.hook';

import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { SearchActions, SearchState } from './SearchStateProvider';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/layout/popover';

export const DesktopSearch: React.FC<SearchState & SearchActions> = ({
  query,
  setQuery,
}) => {
  const { isMounted } = useMounted();
  if (!isMounted) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <SearchInput query={query} setQuery={setQuery} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[var(--radix-popover-trigger-width)] max-w-none p-0"
        side="bottom"
        align="start"
      >
        <SearchResults query={query} />
      </PopoverContent>
    </Popover>
  );
};
