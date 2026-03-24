import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { ClerkProvider } from '@clerk/nextjs';

import { QueryContextProvider } from '@shared/context/react-query-client';
import { ClerkTokenProvider } from '@shared/components/shared/ClerkTokenProvider';
import { Toaster } from '@shared/components/ui/info/toaster';

import '../globals.css';
import AdminLayoutWrapper from './_AdminLayoutWrapper';

export const metadata: Metadata = {
  icons: 'favicon.ico',
  title: {
    default: 'DzenvoShop Admin',
    template: '%s | DzenvoShop Admin',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={GeistSans.className}>
          <ClerkTokenProvider>
            <QueryContextProvider>
              <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
              <Toaster />
            </QueryContextProvider>
          </ClerkTokenProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
