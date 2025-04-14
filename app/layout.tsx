import { AuthProvider } from '@/context/auth-context';
import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Header } from '@/components/shared/header';
import Footer from '@/components/shared/footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'Home - StayHere',
    template: '%s',
  },
  description: 'Discover and book unique accommodations around the world',
  icons: {
    icon: '/logo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
