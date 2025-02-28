import React from 'react';

import { IReview } from '@/types';
import ProfileReviewList from './ProfileReviewList';
import QueryParamController from '@/components/shared/QueryParamController';
import FilterReviewsProfile from './filters/FilterReviewsProfile';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import { Separator } from '@/components/ui/layout/separator';
import PaginateList from '@/components/ui/pagination/paginate-list';

type ProfileReviewsProps = {
  data: {
    reviews: IReview[];
    totalReviews: number;
  };
};

const ProfileReviews: React.FC<ProfileReviewsProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-5">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>My Reviews</CardTitle>
          <CardDescription>All your reviews for products.</CardDescription>
        </div>
        <FilterReviewsProfile />
      </CardHeader>
      <Separator />
      <CardContent>
        <ProfileReviewList reviews={data.reviews} />
      </CardContent>
      {data.totalReviews > 10 && (
        <CardFooter>
          <QueryParamController<string> paramKey="page" defaultValue="1">
            {({ value, onChange }) => (
              <PaginateList
                onPageChange={(value) => onChange(String(value))}
                totalItems={data.totalReviews}
                itemsPerPage={10}
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
