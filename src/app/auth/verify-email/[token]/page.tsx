'use client';

import dynamic from 'next/dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import Link from 'next/link';
// Original component
function VerifyEmailPage() {
  const router = typeof window !== "undefined" ? useRouter() : null;
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid or missing verification token');
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }, { cache: "no-store" }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setSuccess(true);
        } else {
          setError(data.message || 'An error occurred during verification');
        }
      } catch (err) {
        setError('An error occurred during verification');
        console.error('Email verification error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-8">
                <Spinner size="large" className="mb-4" />
                <p className="text-gray-600">Verifying your email address...</p>
              </div>
            ) : success ? (
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 bg-green-600 rounded-full opacity-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <Alert type="success" className="mb-4">
                  Your email has been verified successfully!
                </Alert>
                <p className="text-sm text-gray-600 mb-6">
                  Thank you for verifying your email address. You can now access all features of the EdPsych AI Education Platform.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => router?.push('/dashboard')}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router?.push('/')}
                    className="w-full"
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 bg-red-600 rounded-full opacity-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <Alert type="error" className="mb-4">
                  {error || 'Verification failed'}
                </Alert>
                <p className="text-sm text-gray-600 mb-6">
                  We couldn't verify your email address. The verification link may have expired or is invalid.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => router?.push('/auth/verify-email')}
                    className="w-full"
                  >
                    Request New Verification Link
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router?.push('/auth/signin')}
                    className="w-full"
                  >
                    Return to Sign In
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Need help? <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}


// Client-side wrapper to ensure router hooks are properly mounted
const VerifyEmailPageWrapper = dynamic(
  () => Promise.resolve(VerifyEmailPage),
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

export default VerifyEmailPageWrapper;