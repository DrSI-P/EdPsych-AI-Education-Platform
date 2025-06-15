'use client';

import React from 'react';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add logging to debug auth layout issues
  useEffect(() => {
    console.log('[Auth/Layout] Auth layout mounted');
    
    return () => {
      console.log('[Auth/Layout] Auth layout unmounted');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {children}
    </div>
  );
}