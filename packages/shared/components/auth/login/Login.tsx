import Link from 'next/link';

import LoginForm from './forms/LoginForm';
import Logo from '../../layout/header/Logo';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../../ui/layout/card';

interface LoginProps {
  showSignupLink?: boolean;
}

const Login: React.FC<LoginProps> = ({ showSignupLink = true }) => {
  return (
    <Card className="flex flex-col sm:w-[450px]">
      <CardHeader className="m-auto space-y-4">
        <Logo />
      </CardHeader>
      <CardContent className="pt-0">
        <LoginForm />
      </CardContent>
      {showSignupLink && (
        <CardFooter className="justify-center">
          <p className="text-muted-foreground">
            Dont have account?{' '}
            <Link href="/signup" className="text-blue-600 underline">
              Signup
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default Login;
