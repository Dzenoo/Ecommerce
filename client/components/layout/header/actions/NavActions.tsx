'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';

import { useCurrentUser } from '@/hooks/queries/useCurrentUser.query';
import { useAuth } from '@/hooks/core/useAuth.hook';
import { getRoleSpecificData } from '@/lib/utils';

import Logo from '../Logo';

import { Input } from '@/components/ui/form/input';
import { Button } from '@/components/ui/buttons/button';
import { TooltipWrapper } from '@/components/ui/info/tooltip-wrapper';

const NavActions: React.FC = () => {
  const { data: currentUser } = useCurrentUser();
  const { logout } = useAuth();

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === 'admin';
  const roleData = getRoleSpecificData(isAdmin);

  return (
    <div className="base-padding flex items-center justify-between gap-10 bg-white py-5">
      <div>
        <Logo />
      </div>

      <div className="basis-1/3">
        <Input showSearchIcon placeholder="Enter concept to search...." />
      </div>

      <div className="flex items-center gap-5">
        {roleData.actions.map(({ id, icon, text, href }) => (
          <TooltipWrapper key={id} tooltip={text}>
            <Link href={href}>{React.createElement(icon)}</Link>
          </TooltipWrapper>
        ))}

        {!isAuthenticated && (
          <Link href="/signup">
            <Button>
              <User />
              Signup
            </Button>
          </Link>
        )}

        {isAuthenticated && (
          <button onClick={logout}>
            <LogOut />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavActions;
