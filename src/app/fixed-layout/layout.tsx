import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/mobile-fixes.css';

export const metadata: Metadata = {
  title: 'EdPsych Connect - Fixed Layout',
  description: 'Educational Psychology Platform with Fixed Layout',
};

export default function FixedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}