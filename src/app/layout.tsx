import React from 'react';
import type { Metadata } from 'next';
import { LayoutWrapper } from './layout-wrapper';
import './globals.css';

// Export metadata for the page
export const metadata: Metadata = {
  title: 'EdPsych Connect',
  description: 'Educational Psychology Platform',
};

// This is a Server Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}