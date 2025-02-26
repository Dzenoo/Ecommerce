import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import { QueryContextProvider } from '@/context/react-query-client';
import { AuthProvider } from '@/components/shared/AuthProvider';

import RootLayoutWrapper from './_RootLayoutWrapper';
import '../globals.css';
import { Toaster } from '@/components/ui/info/toaster';

export const metadata: Metadata = {
  icons: 'favicon.ico',
  title: {
    default: 'DzenvoShop | Your Online Ecommerce Store',
    template: '%s | DzenvoShop',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <QueryContextProvider>
          <AuthProvider>
            <RootLayoutWrapper>{children}</RootLayoutWrapper>
          </AuthProvider>
          <Toaster />
        </QueryContextProvider>
      </body>
    </html>
  );
}
