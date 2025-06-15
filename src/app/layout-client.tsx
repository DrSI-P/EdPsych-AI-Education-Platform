"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { TenantProvider } from '@/lib/tenant-context-railway';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  
  // Add logging to help diagnose issues
  useEffect(() => {
    console.log('[RootLayoutClient] Root layout client mounted');
    
    return () => {
      console.log('[RootLayoutClient] Root layout client unmounted');
    };
  }, []);

  return (
    <SessionProvider>
      <TenantProvider>
        {children}
      </TenantProvider>
    </SessionProvider>
  );
}