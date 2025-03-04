import { getCategory } from '@/lib/utils';
import { Category } from '@/types';

import { Button } from '@/components/ui/buttons/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/layout/dropdown-menu';

type PickCategoryProps = {
  categories: Category[];
  selectedCategory: number;
  onSelect: (category: Category) => void;
  triggerLabel?: string;
};

const PickCategory: React.FC<PickCategoryProps> = ({
  categories,
  selectedCategory,
  onSelect,
  triggerLabel = 'Select Category',
}) => {
  const renderMenuItems = (cats: Category[]) => {
    return cats.map((cat) => {
      if (cat.subcategories && cat.subcategories.length > 0) {
        return (
          <DropdownMenuSub key={cat.id}>
            <DropdownMenuSubTrigger>{cat.name}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {renderMenuItems(cat.subcategories)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        );
      }

      return (
        <DropdownMenuItem key={cat.id} onSelect={() => onSelect(cat)}>
          {cat.name}
        </DropdownMenuItem>
      );
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[150px] justify-start px-3 py-1 text-sm"
        >
          {selectedCategory
            ? getCategory('id', selectedCategory)?.name
            : triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-w-none p-0">
        {renderMenuItems(categories)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PickCategory;
