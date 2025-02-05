'use client';

import { useMediaQuery } from '@/hooks/core/useMediaQuery.hook';

import { SearchStateProvider } from './SearchStateProvider';
import { DesktopSearch } from './DesktopSearch';
import { MobileSearch } from './MobileSearch';

const SearchContainer: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <SearchStateProvider>
      {(state, actions) =>
        isDesktop ? (
          <DesktopSearch {...state} {...actions} />
        ) : (
          <MobileSearch {...state} {...actions} />
        )
      }
    </SearchStateProvider>
  );
};

export const NavSearch: React.FC = () => <SearchContainer />;
