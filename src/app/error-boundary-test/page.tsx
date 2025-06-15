'use client';

import dynamic from 'next/dynamic';

import React from 'react';

/**
 * Error Boundary Test Page
 * 
 * This page provides a testing environment for the error boundary components,
 * allowing developers to validate error handling across different scenarios.
 */

// Original component

const ErrorBoundaryTest = dynamic(
  () => import('@/components/error-boundary/error-boundary-test')
);

function ErrorBoundaryTestPage() {
  return (
    <div className="container mx-auto py-8">
      <ErrorBoundaryTest />
    </div>
  );
}


export default ErrorBoundaryTestPage;