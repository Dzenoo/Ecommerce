import Image from 'next/image';
import Link from 'next/link';

import { IReview } from '@shared/types';
import { getCategory } from '@shared/lib/utils';
import { renderRating } from '@shared/helpers/render-rating';

import { Button } from '@shared/components/ui/buttons/button';
import { Separator } from '@shared/components/ui/layout/separator';

type ProfileReviewItemProps = {
  review: IReview;
};

const ProfileReviewItem: React.FC<ProfileReviewItemProps> = ({ review }) => {
  const productUrl = `/products/${getCategory('id', review.product.category)?.name.toLowerCase()}/${review.product._id}`;

  return (
    <li className="space-y-5 rounded-lg border p-5">
      <div className="flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-start">
        <div className="flex items-center gap-5 max-sm:flex-col max-sm:items-start">
          <div>
            <Link href={productUrl}>
              <Image
                src={review.product.images[0]}
                alt={review.product.name}
                width={80}
                height={80}
                className="min-h-20 min-w-20 object-cover"
              />
            </Link>
          </div>
          <div>
            <h1 className="font-medium">{review.product.name}</h1>
          </div>
        </div>
        <div>
          <Button className="max-sm:w-full" asChild>
            <Link href={productUrl}>Edit Review</Link>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          {renderRating(review.product.averageRating)}
        </div>
        {review.comment && (
          <div>
            <p>{review.comment}</p>
          </div>
        )}
      </div>
    </li>
  );
};

export default ProfileReviewItem;
