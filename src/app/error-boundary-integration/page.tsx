'use client';

import dynamic from 'next/dynamic';

import React from 'react';

/**
 * Error Boundary Integration Page
 * 
 * This page provides documentation and guidelines for integrating
 * error boundaries throughout the platform.
 */

// Original component

const ErrorBoundaryIntegration = dynamic(
  () => import('@/components/error-boundary/error-boundary-integration')
);

function ErrorBoundaryIntegrationPage() {
  return (
    <div className="container mx-auto py-8">
      <ErrorBoundaryIntegration />
    </div>
  );
}


export default ErrorBoundaryIntegrationPage;