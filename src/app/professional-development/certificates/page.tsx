'use client';

// import React from 'react'; // Unused import
import CertificateGenerator from '@/components/professional-development/certificate-generator';

export default function CertificatePage() : React.ReactNode {
  return (
    <div className="min-h-screen bg-background">
      <CertificateGenerator />
    </div>
  );
}
