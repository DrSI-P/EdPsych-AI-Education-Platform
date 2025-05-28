import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loading';

// Import the client component that uses useSearchParams
import { ResetPasswordWithParams } from './reset-password-with-params';

// Main page component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-centre justify-centre bg-grey-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-centre mb-8">
            <h1 className="text-3xl font-bold">Reset Your Password</h1>
            <p className="mt-2 text-grey-600">
              Loading...
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-centre py-8">
                <Spinner size="lg" className="mb-4" />
                <p className="text-grey-600">Loading password reset form...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ResetPasswordWithParams />
    </Suspense>
  );
}
