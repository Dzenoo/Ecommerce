import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, User } from 'lucide-react';

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
    {
      id: 3,
      icon: <User width={20} height={20} />,
      text: 'Register',
      href: '/register',
    },
  ];

  return (
    <div className="base-padding bg-white py-5 flex items-center justify-between gap-10">
      <div>
        <Logo />
      </div>

      <div className="basis-1/3">
        <Input showSearchIcon placeholder="Enter concept to search...." />
      </div>

      <div className="flex items-center gap-5">
        {NavActionsLinks.map(({ id, icon, text, href }) =>
          id === 3 ? (
            <Link href={href} key={id}>
              <Button>
                {icon}
                {text}
              </Button>
            </Link>
          ) : (
            <TooltipProvider key={id} delayDuration={400}>
              <Tooltip>
                <TooltipTrigger>
                  <Link href={href} key={id}>
                    {icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{text}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ),
        )}
      </div>
    </div>
  );
};

export default NavActions;
