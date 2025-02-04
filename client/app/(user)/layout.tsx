import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import '../globals.css';
import UserLayoutWrapper from './_UserLayoutWrapper';
import { Toaster } from '@/components/ui/info/toaster';

export const metadata: Metadata = {
  icons: 'favicon.ico',
  title: {
    default: 'DzenvoShop',
    template: '%s | DzenvoShop',
  },
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <UserLayoutWrapper>{children}</UserLayoutWrapper>
        <Toaster />
      </body>
    </html>
  );
}
