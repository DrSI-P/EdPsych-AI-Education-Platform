'use client';

import dynamic from 'next/dynamic';

import React from 'react';


/**
 * Not Found Page
 * 
 * This page is automatically displayed when a route is not found (404 error).
 * It uses the CustomErrorPage component to provide a user-friendly error experience.
 */


const CustomErrorPage = dynamic(
  () => import('@/components/error/custom-error-page'),
  { ssr: false }
);

function NotFound() {
  return (
    <CustomErrorPage 
      statusCode={404}
      title="Page Not Found"
      description="The page you are looking for doesn't exist or has been moved."
      showHomeButton={true}
      showBackButton={true}
    />
  );
}

export default CustomErrorPage;
