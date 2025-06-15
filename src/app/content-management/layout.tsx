"use client";

import React from 'react';
import { ToastProvider } from '@/components/ui/toast';

export default function ContentManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
