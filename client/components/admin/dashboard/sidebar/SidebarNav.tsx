import React from 'react';
import Link from 'next/link';

import { AdminNavbarActions } from '@/constants';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/layout/sidebar';

const SidebarNav: React.FC = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {AdminNavbarActions.map((item) => {
            const hasSubActions = item.subActions.length === 0;

            const Button = (
              <SidebarMenuButton asChild>
                {hasSubActions ? (
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.text}</span>
                  </Link>
                ) : (
                  <div>
                    <item.icon />
                    <span>{item.text}</span>
                  </div>
                )}
              </SidebarMenuButton>
            );

            if (!hasSubActions) {
              return (
                <SidebarMenuItem key={item.id}>
                  {Button}
                  <SidebarMenuSub>
                    {item.subActions.map((subAction) => (
                      <SidebarMenuSubItem key={subAction.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subAction.href}>
                            <subAction.icon />
                            <span>{subAction.text}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              );
            }

            return <SidebarMenuItem key={item.id}>{Button}</SidebarMenuItem>;
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarNav;
