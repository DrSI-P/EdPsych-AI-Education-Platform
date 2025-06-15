'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { withAuthProtection } from '@/contexts/AuthContext';

const SubscriptionManagement = dynamic(
  () => import('@/components/subscription').then(mod => ({ default: mod.SubscriptionManagement })),
  { ssr: false }
);

function SubscriptionPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
      <p className="text-muted-foreground mb-8">
        Manage your subscription, view available plans, and purchase credits.
      </p>
      
      <SubscriptionManagement />
    </div>
  );
}

// Protect this page with authentication
export default withAuthProtection(SubscriptionPage);