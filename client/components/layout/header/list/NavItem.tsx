'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/types';

interface NavItemProps {
  category: Category;
  depth?: number;
}

const NavItem: React.FC<NavItemProps> = ({ category, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubcategories = Boolean(category.subcategories?.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') setIsOpen(true);
    if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <li
      role="menuitem"
      aria-haspopup={hasSubcategories}
      aria-expanded={isOpen}
      className="group relative z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <Link
        href={category.href}
        className={`hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
          depth > 0 ? 'pl-4 pr-2' : 'px-4'
        }`}
        tabIndex={depth > 0 ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {category.name}
        {hasSubcategories && (
          <ChevronRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
        )}
      </Link>

      {hasSubcategories && (
        <ul
          role="menu"
          className={`bg-popover absolute ${
            depth === 0 ? 'left-full top-0' : 'right-full top-0'
          } min-w-52 rounded-xl border p-2 shadow-lg transition-opacity ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          style={{
            marginLeft: depth === 0 ? '0.25rem' : '-0.25rem',
            transition: 'opacity 150ms ease-in-out',
          }}
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
