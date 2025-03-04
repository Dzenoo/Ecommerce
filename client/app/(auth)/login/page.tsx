'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { useMounted } from '@/hooks/core/useMounted.hook';
import { useToast } from '@/hooks/core/use-toast';

import Login from '@/components/auth/login/Login';

const LoginPage = () => {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
};

const LoginPageContent = () => {
  const { isMounted } = useMounted();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (!isMounted || !error) return;

    toast({
      title: 'Authentication Error',
      variant: 'destructive',
      description: error,
    });
  }, [isMounted, error, toast]);

  return (
    <section className="flex h-screen items-center justify-center">
      <Login />
    </section>
  );
};

export default LoginPage;
