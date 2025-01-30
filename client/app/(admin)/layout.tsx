import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import '../globals.css';
import AdminLayoutWrapper from './_AdminLayoutWrapper';
import { Toaster } from '@/components/ui/info/toaster';

export const metadata: Metadata = {
  icons: 'favicon.ico',
  title: {
    default: 'DzenvoShop | Your Online Ecommerce Store',
    template: '%s | DzenvoShop',
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
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
        <Toaster />
      </body>
    </html>
  );
}
