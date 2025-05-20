import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
// Import metadata from separate file
import { metadata } from './metadata';
import { VercelSpeedInsights } from './speed-insights';
import { VercelAnalytics } from './analytics';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

// Metadata is now imported from a separate file
export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers children={children}>
          {children}
        </Providers>
        <VercelSpeedInsights />
        <VercelAnalytics />
      </body>
    </html>
  );
}
