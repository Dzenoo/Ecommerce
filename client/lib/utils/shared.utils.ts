import { COLORS, SIZES } from '@/constants';

export const getColorsLabelAndValue = () => {
  const formatted = COLORS.map((color) => ({
    label: color
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: color,
  }));

  return formatted;
};

export const getSizesLabelAndValue = () => {
  const formatted = SIZES.map((size) => ({
    label: size,
    value: size.toLowerCase(),
  }));

  return formatted;
};
