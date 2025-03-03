import React from 'react';
import { useSearchParams } from 'next/navigation';

import {
  ReviewQueryType,
  useReviewQuery,
} from '@/hooks/queries/useReview.query';
import { useAuthStore } from '@/store/auth.store';
import QueryParamController from '@/components/shared/QueryParamController';
import ReviewList from './ReviewList';
import ReviewForm from './forms/ReviewForm';
import LoadingReviews from '@/components/shared/loading/products/LoadingReviews';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';
import {
  Select,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectTrigger,
  SelectGroup,
} from '@/components/ui/form/select';

type ReviewsProps = {
  productId: string;
};

const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const query = {
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 10),
    sort: searchParams.get('sort') || 'desc',
  };

  const { data, isLoading } = useReviewQuery({
    type: ReviewQueryType.GET_ALL,
    params: { productId: productId, query },
  });

  if (isLoading) {
    return <LoadingReviews />;
  }

  if (!data) {
    return null;
  }

  const totalReviews = data.data.totalReviews;
  const remainingReviews = totalReviews - query.limit;

  return (
    <div id="reviews" className="relative space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <h1 className="text-muted-foreground">Reviews and Ratings</h1>
        </div>
        <QueryParamController<string>
          paramKey="sort"
          defaultValue=""
          transform={{
            decode: (value: string | string[]) =>
              Array.isArray(value) ? value[0] || '' : value || '',
            encode: (value) => value,
          }}
        >
          {({ onChange, value }) => (
            <Select value={value || undefined} onValueChange={onChange}>
              <SelectTrigger className="w-[150px] max-sm:w-full">
                <SelectValue placeholder="Sort Reviews"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="desc">Newest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </QueryParamController>
      </div>
      <Separator />
      <div className="hide-scrollbar max-h-96 space-y-5 overflow-y-scroll">
        <ReviewList reviews={data.data.reviews} />
        <div className="flex items-center justify-center">
          {remainingReviews > 0 && (
            <QueryParamController<string> paramKey="limit" defaultValue="10">
              {({ value, onChange }) => (
                <Button
                  onClick={() =>
                    onChange(String(Math.min(query.limit + 10, totalReviews)))
                  }
                >
                  Load More
                </Button>
              )}
            </QueryParamController>
          )}
        </div>
      </div>
      {user?.role === 'user' && (
        <div className="sticky bottom-0">
          <ReviewForm productId={productId} />
        </div>
      )}
    </div>
  );
};

export default Reviews;
