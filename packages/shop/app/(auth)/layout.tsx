import { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { QueryContextProvider } from '@shared/context/react-query-client';
import { Toaster } from '@shared/components/ui/info/toaster';

import '../globals.css';
import AuthLayoutWrapper from './_AuthLayoutWrapper';

const sg = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  icons: 'favicon.ico',
  title: {
    default: 'Ecommerce | Authentication',
    template: '%s | Ecommerce',
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={sg.className}>
          <QueryContextProvider>
            <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
          </QueryContextProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
