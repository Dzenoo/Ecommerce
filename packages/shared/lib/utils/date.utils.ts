import { format } from 'date-fns';

/**
 * Formats a date string to a specified format.
 * @param date - The date to format.
 * @param formatStr - The format string (default: "dd/MM/yyyy").
 * @returns The formatted date string.
 */
export const formatDate = (
  date: Date,
  formatStr: string = 'dd/MM/yyyy',
): string => {
  return date ? format(new Date(date), formatStr) : '';
};
