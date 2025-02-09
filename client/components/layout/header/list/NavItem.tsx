'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Category } from '@/types';

type NavItemProps = {
  category: Category;
  depth?: number;
};

const NavItem: React.FC<NavItemProps> = ({ category, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubcategories = Boolean(category.subcategories?.length);

  return (
    <li
      className="group relative z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={category.href}
        className={cn(
          'flex w-full items-center justify-between rounded-lg py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
          depth > 0 ? 'pl-4 pr-2' : 'px-4',
        )}
        tabIndex={depth > 0 ? -1 : 0}
      >
        {category.name}
        {hasSubcategories && (
          <ChevronRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
        )}
      </Link>

      {hasSubcategories && (
        <ul
          className={cn(
            'absolute top-0 min-w-52 rounded-lg border bg-popover p-2 shadow-lg transition-opacity',
            depth === 0 ? 'left-full ml-1' : 'right-full -ml-1',
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          {category.subcategories?.map((sub) => (
            <NavItem key={sub.id} category={sub} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavItem;
