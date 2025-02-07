import { Category } from '@/types';
import { CATEGORY_LIST } from '@/constants';

/**
 * Recursively searches for a category by its ID within a list of categories and their subcategories.
 *
 * @param id - The ID of the category to search for.
 * @param categories - The list of categories to search within.
 * @returns The category with the specified ID, or undefined if not found.
 */
export const getCategoryById = (
  id: number,
  categories = CATEGORY_LIST,
): Category | undefined => {
  for (const category of categories) {
    if (category.id === id) return category;
    if (category.subcategories) {
      const found = getCategoryById(id, category.subcategories);
      if (found) return found;
    }
  }
  return undefined;
};
