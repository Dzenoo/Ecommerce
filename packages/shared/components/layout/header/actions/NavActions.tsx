'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

import { useCurrentUser } from '../../../../hooks/useCurrentUser';
import { getRoleSpecificData } from '../../../../lib/utils';

import Logo from '../Logo';
import { NavSearch } from './search/NavSearch';

import { Button } from '../../../ui/buttons/button';
import { TooltipWrapper } from '../../../ui/info/tooltip-wrapper';

const NavActions: React.FC<{
  showSearch?: boolean;
}> = ({ showSearch = true }) => {
  const { user, isAuthenticated } = useCurrentUser();
  const { signOut } = useClerk();

  const isAdmin = user?.role === 'admin';
  const roleData = getRoleSpecificData(isAdmin);

  return (
    <div className="base-padding hide-scrollbar flex items-center justify-between gap-10 bg-white py-5">
      <div>
        <Logo />
      </div>

      {showSearch && (
        <div className="basis-1/3">
          <NavSearch />
        </div>
      )}

      <div className="flex items-center gap-5">
        {isAuthenticated &&
          roleData.actions.map(({ id, icon, text, href }) => (
            <TooltipWrapper key={id} tooltip={text}>
              <Link href={href}>{React.createElement(icon)}</Link>
            </TooltipWrapper>
          ))}

        {!isAuthenticated && (
          <Link href="/sign-up">
            <Button>
              <User />
              Sign Up
            </Button>
          </Link>
        )}

        {isAuthenticated && (
          <button onClick={() => signOut()}>
            <LogOut />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavActions;
