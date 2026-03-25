import { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { QueryContextProvider } from '@shared/context/react-query-client';
import { ClerkTokenProvider } from '@shared/components/shared/ClerkTokenProvider';
import { Toaster } from '@shared/components/ui/info/toaster';

import '../globals.css';
import UserLayoutWrapper from './_UserLayoutWrapper';

const sg = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

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
    <ClerkProvider>
      <html lang="en">
        <body className={sg.className}>
          <ClerkTokenProvider>
            <QueryContextProvider>
              <UserLayoutWrapper>{children}</UserLayoutWrapper>
              <Toaster />
            </QueryContextProvider>
          </ClerkTokenProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
