'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// import React from "react"; // Unused import

// Dynamically import the actual component with SSR disabled
const AdminUserManagementContent = dynamic(
  () => import('@/components/admin/user-management'),
  { ssr: false }
);

export default function ClientPage() : React.ReactNode {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 px-4">Loading user management...</div>}>
      <AdminUserManagementContent />
    </Suspense>
  );
}