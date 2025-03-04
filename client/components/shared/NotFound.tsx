import Link from 'next/link';

import { Button } from '@/components/ui/buttons/button';

const NotFound: React.FC<{ href?: string }> = ({ href = '/' }) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl font-semibold">404</h1>
      <h2 className="mb-6 text-2xl font-semibold text-muted-foreground dark:text-white">
        Oops! Page Not Found
      </h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground dark:text-muted-foreground">
        We are sorry, but the page you are looking for doesnt exist or has been
        moved.
      </p>
      <Link href={href}>
        <Button>Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
