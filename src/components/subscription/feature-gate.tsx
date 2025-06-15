'use client';

import React, { ReactNode } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface FeatureGateProps {
  /**
   * The ID of the feature to check access for
   */
  featureId: string;
  
  /**
   * The content to render if the user has access to the feature
   */
  children: ReactNode;
  
  /**
   * Optional title for the upgrade prompt
   */
  upgradeTitle?: string;
  
  /**
   * Optional description for the upgrade prompt
   */
  upgradeDescription?: string;
  
  /**
   * Optional credit cost for the feature
   * If provided, will show a "Use Credits" button
   */
  creditCost?: number;
  
  /**
   * Optional callback when credits are used
   */
  onUseCredits?: () => void;
  
  /**
   * Optional flag to render nothing instead of the upgrade prompt
   */
  renderNothing?: boolean;
}

/**
 * A component that gates content based on subscription feature access
 */
export function FeatureGate({
  featureId,
  children,
  upgradeTitle = 'Premium Feature',
  upgradeDescription = 'This feature requires a subscription upgrade or credits to access.',
  creditCost,
  onUseCredits,
  renderNothing = false,
}: FeatureGateProps) {
  const { hasFeatureAccess, useCredits, creditBalance, features } = useSubscription();
  const router = useRouter();
  
  // Check if the user has access to the feature
  const hasAccess = hasFeatureAccess(featureId);
  
  // If the user has access, render the children
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // If renderNothing is true, render nothing
  if (renderNothing) {
    return null;
  }
  
  // Get feature details if available
  const feature = features.find(f => f.id === featureId);
  const featureName = feature?.displayName || upgradeTitle;
  const featureDescription = feature?.description || upgradeDescription;
  const featureCreditCost = creditCost || feature?.creditCost || 0;
  
  // Handle using credits
  const handleUseCredits = async () => {
    if (featureCreditCost && featureCreditCost > 0) {
      const success = await useCredits(featureId, featureCreditCost);
      
      if (success && onUseCredits) {
        onUseCredits();
      }
    }
  };
  
  // Render the upgrade prompt
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{featureName}</CardTitle>
        <CardDescription>{featureDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-muted-foreground mb-4"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="mb-2 text-sm text-muted-foreground">
            Upgrade your subscription to access this feature
          </p>
          {featureCreditCost > 0 && (
            <p className="text-sm text-muted-foreground">
              Or use {featureCreditCost} credits (you have {creditBalance} available)
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/account/subscription')}
        >
          View Plans
        </Button>
        
        {featureCreditCost > 0 && creditBalance >= featureCreditCost && (
          <Button onClick={handleUseCredits}>
            Use {featureCreditCost} Credits
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

/**
 * A higher-order component that gates a component based on subscription feature access
 */
export function withFeatureGate<P extends object>(
  Component: React.ComponentType<P>,
  featureId: string,
  options: Omit<FeatureGateProps, 'featureId' | 'children'> = {}
): React.FC<P> {
  return (props: P) => (
    <FeatureGate featureId={featureId} {...options}>
      <Component {...props} />
    </FeatureGate>
  );
}