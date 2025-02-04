'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, User } from 'lucide-react';

import { useCurrentUser } from '@/hooks/queries/useCurrentUser.query';

import Logo from '../Logo';

import { Input } from '@/components/ui/form/input';
import { Button } from '@/components/ui/buttons/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/info/tooltip';

const NavActions: React.FC = () => {
  const { data: currentUser } = useCurrentUser();

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === 'admin';

  const NavActionsLinks = [
    {
      id: 1,
      icon: <Heart width={20} height={20} />,
      text: 'Wishlist',
      href: '/wishlist',
    },
    {
      id: 2,
      icon: <ShoppingBag width={20} height={20} />,
      text: 'Cart',
      href: '/cart',
    },
  ];

  return (
    <div className="base-padding flex items-center justify-between gap-10 bg-white py-5">
      <div>
        <Logo />
      </div>

      <div className="basis-1/3">
        <Input showSearchIcon placeholder="Enter concept to search...." />
      </div>

      <div className="flex items-center gap-5">
        {NavActionsLinks.map(({ id, icon, text, href }) => (
          <TooltipProvider key={id} delayDuration={400}>
            <Tooltip>
              <TooltipTrigger>
                <Link href={href}>{icon}</Link>
              </TooltipTrigger>
              <TooltipContent>{text}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {!isAuthenticated && (
          <Link href="/signup">
            <Button>
              <User width={20} height={20} />
              Signup
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavActions;
