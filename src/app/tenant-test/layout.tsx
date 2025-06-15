"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { TenantProvider } from '../../lib/tenant-context-railway';

export default function TenantTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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