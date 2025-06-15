"use client";

import React from 'react';
// TODO: Review Supabase usage and migrate to Railway
import { EnhancedThemeProvider } from '@/components/enhanced-theme-provider';
import { TenantProvider } from '@/lib/railway-tenant-context';
import { RailwayDbProvider } from '@/lib/railway-provider';
import { AvatarProvider } from '@/components/Avatar/AvatarProvider';
import { Analytics } from '@/components/analytics';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <RailwayDbProvider>
              <TenantProvider>
                <EnhancedThemeProvider>
                  <AvatarProvider>
                    <Analytics />
                    {children}
                  </AvatarProvider>
                </EnhancedThemeProvider>
              </TenantProvider>
            </RailwayDbProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
