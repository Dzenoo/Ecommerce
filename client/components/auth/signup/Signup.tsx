import React from 'react';

import RedirectToLoginLink from './RedirectToLoginLink';
import SignupForm from './forms/SignupForm';
import Logo from '@/components/layout/header/Logo';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/layout/card';

const Signup: React.FC = () => {
  return (
    <Card className="flex flex-col lg:w-[600px]">
      <CardHeader className="m-auto space-y-4">
        <Logo />
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
      <CardFooter className="justify-center">
        <RedirectToLoginLink />
      </CardFooter>
    </Card>
  );
};

export default Signup;
