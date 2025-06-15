"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// This prevents Next.js from trying to statically generate this page
const ClientPage = dynamic(
  () => import('@/components/admin/user-management-client')
);

function AdminUserManagement() {
  return <ClientPage />;
}

export default ClientPage;
