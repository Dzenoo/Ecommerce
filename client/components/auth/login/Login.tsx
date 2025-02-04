import React from 'react';
import Link from 'next/link';

import LoginForm from './forms/LoginForm';
import Logo from '@/components/layout/header/Logo';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/layout/card';

const Login: React.FC = () => {
  return (
    <Card className="flex flex-col sm:w-[450px]">
      <CardHeader className="m-auto space-y-4">
        <Logo />
      </CardHeader>
      <CardContent className="pt-0">
        <LoginForm />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground">
          Dont have account?{' '}
          <Link href="/signup" className="text-blue-600 underline">
            Signup
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;
