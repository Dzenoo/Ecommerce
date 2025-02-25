import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';

import { CreateReviewSchema } from '@/lib/zod/review.zod';
import Loader from '@/components/ui/info/loader';
import {
  ReviewMutationType,
  useReviewMutation,
} from '@/hooks/mutations/useReview.mutation';
import { ProductQueryType } from '@/hooks/queries/useProduct.query';
import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import { ReviewQueryType } from '@/hooks/queries/useReview.query';

import { Button } from '@/components/ui/buttons/button';
import { Textarea } from '@/components/ui/form/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form/form';

type ReviewFormValues = z.infer<typeof CreateReviewSchema>;

type ReviewFormProps = {
  productId: string;
};

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const { toast } = useToast();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(CreateReviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const mutation = useReviewMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [
          'products',
          {
            type: ProductQueryType.GET_ONE,
            params: { productId },
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'reviews',
          {
            type: ReviewQueryType.GET_ALL,
            params: { productId },
          },
        ],
      });

      form.reset();
      toast({
        title: 'Success',
        description: response.message,
      });
    },
  });

  const isLoading = mutation.status === 'pending';

  const handleCreateReview = async (values: ReviewFormValues) => {
    mutation.mutateAsync({
      type: ReviewMutationType.CREATE,
      productId: productId,
      data: { ...values },
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(handleCreateReview)}
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Rating *</FormLabel>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`transition-all ${
                      (field.value || 0) >= index + 1
                        ? 'text-yellow-500'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                    onClick={() => field.onChange(index + 1)}
                  >
                    <Star
                      size={15}
                      fill={
                        (field.value || 0) >= index + 1
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  </button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment (optional)</FormLabel>
              <FormControl>
                <Textarea
                  className="max-h-36 min-h-24 resize-y"
                  placeholder="Share your experience with this product..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || !form.formState.isValid}>
          {isLoading ? (
            <Loader type="ScaleLoader" height={10} />
          ) : (
            'Submit Review'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
