'use client';

import dynamic from 'next/dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
// Original component

const useSubscription = dynamic(
  () => import('@/contexts/SubscriptionContext').then(mod => ({ default: mod.useSubscription }))
);

function SubscriptionSuccessPage() {
  const router = typeof window !== "undefined" ? useRouter() : null;
  const searchParams = useSearchParams();
  const { refreshSubscriptionData } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the session ID from the URL
  const sessionId = searchParams?.get('session_id') || null;
  
  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        // Verify the session with the server
        const response = await fetch(`/api/subscriptions/verify-session?session_id=${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken', { cache: "no-store" })}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to verify session');
        }
        
        // Refresh subscription data
        await refreshSubscriptionData();
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error verifying session:', err);
        setError('Failed to verify your subscription. Please contact support.');
        setIsLoading(false);
      }
    };
    
    verifySession();
  }, [sessionId, refreshSubscriptionData]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
        <h1 className="text-2xl font-bold mb-2">Processing Your Subscription</h1>
        <p className="text-muted-foreground">Please wait whilst we confirm your payment...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Subscription Error</CardTitle>
            <CardDescription>There was a problem with your subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router?.push('/account/subscription')}>
              Return to Subscription Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
          <CardDescription>Your subscription has been activated</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thank you for subscribing to EdPsych AI Platform. Your subscription is now active,
            and you can start enjoying all the benefits of your plan.
          </p>
          <p className="text-muted-foreground">
            You can manage your subscription at any time from your account settings.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button onClick={() => router?.push('/account/subscription')}>
            Manage Subscription
          </Button>
          <Button variant="outline" onClick={() => router?.push('/')}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Client-side wrapper to ensure router hooks are properly mounted
const SubscriptionSuccessPageWrapper = dynamic(
  () => Promise.resolve(SubscriptionSuccessPage),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
);

export default SubscriptionSuccessPageWrapper;