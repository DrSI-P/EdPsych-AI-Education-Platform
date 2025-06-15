"use client";

import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/mobile-fixes.css';

export const metadata: Metadata = {
  title: 'EdPsych Connect',
  description: 'Educational Psychology Platform',
};

import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { TenantProvider } from '@/lib/tenant-context-railway';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  
  // Add logging to help diagnose issues
  useEffect(() => {
    console.log('[RootLayout] Root layout mounted');
    
    return () => {
      console.log('[RootLayout] Root layout unmounted');
    };
  }, []);

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <TenantProvider>
            {children}
          </TenantProvider>
        </SessionProvider>
      </body>
    </html>
  );
}