'use client';

import { useSearchParams } from 'next/navigation';

import {
  ReviewQueryType,
  useReviewQuery,
} from '@/hooks/queries/useReview.query';
import ProfileReviewList from './ProfileReviewList';
import FilterReviewsProfile from './filters/FilterReviewsProfile';
import QueryParamController from '@/components/shared/QueryParamController';
import LoadingProfileReviews from '@/components/shared/loading/user/LoadingProfileReviews';

import PaginateList from '@/components/ui/pagination/paginate-list';
import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

const ProfileReviews: React.FC = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    sort: searchParams.get('sort') || 'desc',
  };

  const { data, isLoading } = useReviewQuery({
    type: ReviewQueryType.GET_ALL_BY_USER,
    params: { query: query },
  });

  if (isLoading) {
    return <LoadingProfileReviews />;
  }

  if (!data) {
    return;
  }

  const reviews = data.data.reviews;
  const totalReviews = data.data.totalReviews;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-5 max-sm:flex-col max-sm:items-start">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>My Reviews</CardTitle>
          <CardDescription>All your reviews for products.</CardDescription>
        </div>
        <FilterReviewsProfile />
      </CardHeader>
      <Separator />
      <CardContent>
        <ProfileReviewList reviews={reviews} />
      </CardContent>
      {totalReviews > query.limit && (
        <CardFooter>
          <QueryParamController<string> paramKey="page" defaultValue="1">
            {({ value, onChange }) => (
              <PaginateList
                onPageChange={(value) => onChange(String(value))}
                totalItems={totalReviews}
                itemsPerPage={query.limit}
                currentPage={Number(value)}
              />
            )}
          </QueryParamController>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileReviews;
