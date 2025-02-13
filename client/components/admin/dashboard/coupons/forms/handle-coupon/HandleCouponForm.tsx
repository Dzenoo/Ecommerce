'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateCouponDto, ICoupon } from '@/types';
import { useToast } from '@/hooks/core/use-toast';
import { CreateCouponSchema, UpdateCouponSchema } from '@/lib/zod/coupon.zod';
import {
  CouponMutationType,
  useCouponMutation,
} from '@/hooks/mutations/useCoupon.mutation';
import { queryClient } from '@/context/react-query-client';

import Loader from '@/components/ui/info/loader';

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form/form';

type HandleCouponFormProps =
  | {
      isEdit?: true;
      coupon: ICoupon;
    }
  | { isEdit?: false; coupon: undefined };

const HandleCouponForm: React.FC<HandleCouponFormProps> = (props) => {
  const { toast } = useToast();
  const router = useRouter();

  const schema = props.isEdit ? UpdateCouponSchema : CreateCouponSchema;
  type CouponFormValues = z.infer<typeof schema>;

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      discountType: 'fixed',
      discountValue: 0,
      maxUsage: 0,
      expirationDate: new Date(),
      active: false,
      minPurchaseAmount: 0,
      userLimit: [],
    },
  });

  const couponMutation = useCouponMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });

      form.reset();

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });

      setTimeout(() => {
        router.push('/dashboard/coupons');
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });

  const isLoading = couponMutation.status === 'pending';

  useEffect(() => {
    if (props.isEdit && props.coupon) {
      form.reset({
        ...props.coupon,
      });
    }
  }, [props.coupon, props.isEdit, form]);

  const handleFormSubmit = async (data: CouponFormValues) => {
    if (props.isEdit) {
      const updatePayload: Partial<CreateCouponDto> = {
        ...data,
      };

      return await couponMutation.mutateAsync({
        type: CouponMutationType.UPDATE,
        data: updatePayload,
        couponId: props.coupon._id,
      });
    } else {
      const createPayload: CreateCouponDto = {
        ...data,
        code: data.code!,
        discountType: data.discountType!,
        discountValue: data.discountValue!,
        expirationDate: data.expirationDate!,
      };

      return await couponMutation.mutateAsync({
        type: CouponMutationType.CREATE,
        data: createPayload,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="space-y-10">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type your code for this coupon"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please enter the code for this coupon. This will be used to
                  identify the coupon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type="submit" disabled={!form.formState.isValid}>
            {form.formState.isSubmitting && isLoading ? (
              <Loader type="ScaleLoader" height={20} />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HandleCouponForm;
