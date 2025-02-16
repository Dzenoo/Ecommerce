import { Category } from '@/types';
import { CATEGORY_LIST } from '@/constants';

/**
 * Recursively search for a category by its `id` or `name`.
 *
 * @param {string} by - The key to search by. Either 'id' or 'name'.
 * @param {(number|string)} value - The value of the key to search for.
 * @param {Category[]} [categories=CATEGORY_LIST] - The list of categories to search.
 * @returns {(Category|undefined)} The found category or undefined if not found.
 */
export const getCategory = (
  by: 'id' | 'name',
  value: number | string,
  categories = CATEGORY_LIST,
): Category | undefined => {
  for (const category of categories) {
    if (
      (by === 'id' && category.id === value) ||
      (by === 'name' &&
        category.name.toLowerCase() === value.toString().toLowerCase())
    ) {
      return category;
    }

    if (category.subcategories) {
      const found = getCategory(by, value, category.subcategories);
      if (found) return found;
    }
  }

  return undefined;
};
