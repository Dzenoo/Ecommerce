import { Star } from 'lucide-react';

/**
 * Renders a component with a set of stars representing the average rating.
 * The stars that should be filled are determined by the averageRating parameter.
 * The stars are rendered as Lucide Star icons.
 *
 * @param {number} averageRating - The average rating of the entity being rated.
 */
export const renderRating = (averageRating: number) => {
  const stars = [];
  const filledStars = Math.round(averageRating);

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        color={i <= filledStars ? '#FFAE00' : '#C4C4C4'}
        fill={i <= filledStars ? '#FFAE00' : 'transparent'}
        width={15}
        height={15}
      />,
    );
  }

  return <>{stars}</>;
};
