import { useMounted } from '@/hooks/core/useMounted.hook';

import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

import { Input } from '@/components/ui/form/input';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/layout/drawer';

export const MobileSearch: React.FC = ({}) => {
  const { isMounted } = useMounted();
  if (!isMounted) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="w-full">
          <Input
            showSearchIcon
            placeholder="Enter concept to search..."
            readOnly
          />
        </div>
      </DrawerTrigger>

      <DrawerContent className="h-[90vh] max-h-screen">
        <VisuallyHidden>
          <DrawerTitle>Search</DrawerTitle>
        </VisuallyHidden>

        <div className="flex flex-1 flex-col space-y-5 p-4">
          <SearchInput />

          <div className="flex-1 overflow-y-auto">
            <SearchResults />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
