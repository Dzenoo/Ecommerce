import { CATEGORY_LIST } from '@/constants';

import NavItem from './NavItem';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/layout/navigation-menu';

const NavList: React.FC = () => {
  return (
    <nav className="border-y bg-white px-28 py-5 max-xl:px-10 max-lg:px-5 max-md:px-2">
      <NavigationMenu>
        <NavigationMenuList>
          {CATEGORY_LIST.map(({ id, name, subcategories }) => (
            <NavigationMenuItem key={id}>
              <NavigationMenuTrigger>{name}</NavigationMenuTrigger>
              <NavigationMenuContent className="p-4">
                <ul className="flex min-w-52 flex-col gap-2">
                  {subcategories?.map((subcategory) => (
                    <NavItem key={subcategory.id} category={subcategory} />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
export default NavList;
