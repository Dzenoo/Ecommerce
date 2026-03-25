import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { QueryContextProvider } from '@shared/context/react-query-client';
import { ClerkTokenProvider } from '@shared/components/shared/ClerkTokenProvider';
import { Toaster } from '@shared/components/ui/info/toaster';

import RootLayoutWrapper from './_RootLayoutWrapper';
import '../globals.css';

const sg = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

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
    <ClerkProvider>
      <html lang="en">
        <body className={sg.className}>
          <ClerkTokenProvider>
            <QueryContextProvider>
              <RootLayoutWrapper>{children}</RootLayoutWrapper>
              <Toaster />
            </QueryContextProvider>
          </ClerkTokenProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
