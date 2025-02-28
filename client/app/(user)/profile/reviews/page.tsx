'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import {
  ReviewQueryType,
  useReviewQuery,
} from '@/hooks/queries/useReview.query';
import ProfileReviews from '@/components/user/profile/reviews/ProfileReviews';

const ProfileReviewsPage = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    sort: searchParams.get('sort') || 'desc',
  };

  const { data, isLoading } = useReviewQuery({
    type: ReviewQueryType.GET_ALL_BY_USER,
    params: { query: query },
  });

  if (isLoading) {
    return 'Loading.....';
  }

  if (!data) {
    return;
  }

  return (
    <section>
      <ProfileReviews data={data.data} />
    </section>
  );
};

export default ProfileReviewsPage;
