'use client';

import { useMediaQuery } from '@/hooks/core/useMediaQuery.hook';

import { DesktopSearch } from './DesktopSearch';
import { MobileSearch } from './MobileSearch';

const SearchContainer: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return <>{isDesktop ? <DesktopSearch /> : <MobileSearch />}</>;
};

export const NavSearch: React.FC = () => <SearchContainer />;
