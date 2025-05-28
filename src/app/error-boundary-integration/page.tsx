'use client';

// import React from 'react'; // Unused import
import ErrorBoundaryIntegration from '@/components/error-boundary/error-boundary-integration';

/**
 * Error Boundary Integration Page
 * 
 * This page provides documentation and guidelines for integrating
 * error boundaries throughout the platform.
 */
export default function ErrorBoundaryIntegrationPage() : React.ReactNode {
  return (
    <div className="container mx-auto py-8">
      <ErrorBoundaryIntegration />
    </div>
  );
}
