import { useMounted } from '@/hooks/core/useMounted.hook';

import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/layout/popover';

export const DesktopSearch: React.FC = ({}) => {
  const { isMounted } = useMounted();
  if (!isMounted) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <SearchInput />
        </div>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[var(--radix-popover-trigger-width)] max-w-none p-0 shadow-none"
        side="bottom"
        align="start"
      >
        <SearchResults />
      </PopoverContent>
    </Popover>
  );
};
