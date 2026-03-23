import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import '../globals.css';
import AdminLayoutWrapper from './_AdminLayoutWrapper';
import { Toaster } from '@shared/components/ui/info/toaster';
import { QueryContextProvider } from '@shared/context/react-query-client';

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
    <html lang="en">
      <body className={GeistSans.className}>
        <QueryContextProvider>
          <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
          <Toaster />
        </QueryContextProvider>
      </body>
    </html>
  );
}
