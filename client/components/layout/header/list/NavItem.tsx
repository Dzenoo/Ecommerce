'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Category } from '@/types';

interface NavItemProps {
  category: Category;
}

const NavItem: React.FC<NavItemProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className="group relative z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={category.href}
        className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm font-medium"
      >
        {category.name}
        {category.subcategories && <ChevronRight className="h-4 w-4" />}
      </Link>

      {category.subcategories && isOpen && (
        <ul className="bg-popover absolute left-full top-0 z-50 mt-0 min-w-52 gap-2 rounded-xl border p-3 shadow-lg">
          {category.subcategories.map((sub) => (
            <NavItem key={sub.id} category={sub} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavItem;
