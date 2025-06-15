'use client';

import dynamic from 'next/dynamic';

import React from 'react';

// Original component

const CertificateGenerator = dynamic(
  () => import('@/components/professional-development/certificate-generator')
);

function CertificatePage() {
  return (
    <div className="min-h-screen bg-background">
      <CertificateGenerator />
    </div>
  );
}


export default CertificatePage;