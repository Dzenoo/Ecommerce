'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { signup } from '@/lib/actions/auth.actions';
import { SignupSchema } from '@/lib/zod/auth.zod';
import { useToast } from '@/hooks/core/use-toast';

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

const SignupForm: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { mutateAsync: signupMutation } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      form.reset();
      router.push('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    await signupMutation(values);
  };

  const handleGoogleSignUp = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex items-start gap-3 max-[600px]:flex-wrap">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="First Name" />
                </FormControl>
                <FormDescription>Enter your given name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Last Name" />
                </FormControl>
                <FormDescription>Enter your family or surname.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} placeholder="Email" />
              </FormControl>
              <FormDescription>Enter a valid email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Password" />
              </FormControl>
              <FormDescription>
                Start with uppercase letter, minimum 8 characters and contain
                symbols and numbers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3 text-center">
          <Button
            variant="default"
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <Loader type="ScaleLoader" height={10} />
            ) : (
              'Register'
            )}
          </Button>
          <p className="text-muted-foreground">Or</p>
          <Button
            variant="outline"
            className="flex w-full items-center justify-center"
            disabled={form.formState.isSubmitting}
            type="button"
            onClick={() => handleGoogleSignUp()}
          >
            <Image
              src="/icons/google-icon-logo-transparent.png"
              alt="google-logo"
              width={40}
              height={40}
            />
            Sign up with Google
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
