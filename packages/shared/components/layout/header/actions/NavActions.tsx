"use client";

import React from "react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { CartQueryType, useCartQuery } from "@shared/hooks/queries/useCart.query";

import Logo from "../Logo";
import { NavSearch } from "./search/NavSearch";

import { Button } from "../../../ui/buttons/button";
import { TooltipWrapper } from "../../../ui/info/tooltip-wrapper";
import { UserNavbarActions } from "@shared/constants";
import Loader from "@shared/components/ui/info/loader";

const NavActions: React.FC<{
  showSearch?: boolean;
}> = ({ showSearch = true }) => {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const { signOut } = useClerk();
  const { data: cartData } = useCartQuery(
    {
      type: CartQueryType.GET_CART,
    },
    {
      enabled: isAuthenticated,
    },
  );

  const cartItemsCount =
    cartData?.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className="base-padding hide-scrollbar flex items-center justify-between gap-10 bg-white py-5">
      <div className="max-sm:hidden">
        <Logo />
      </div>

      {showSearch && (
        <div className="basis-1/3 max-sm:basis-full">
          <NavSearch />
        </div>
      )}

      {isLoading ? (
        <Loader type="ScaleLoader" height={10} />
      ) : (
        <div className="flex items-center gap-5">
          {isAuthenticated &&
            UserNavbarActions.map(({ id, icon, text, href }) => (
              <TooltipWrapper key={id} tooltip={text}>
                <Link href={href} className="relative inline-block">
                  {React.createElement(icon)}
                  {href === "/cart" && cartItemsCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                </Link>
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
      )}
    </div>
  );
};

export default NavActions;
