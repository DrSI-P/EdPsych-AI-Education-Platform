import React from 'react';
import { initializeErrorHandler } from "@/utils/errorHandler";
import '@/styles/globals.css';
import '@/styles/mobile-fixes.css';
import { LayoutWrapper } from './layout-wrapper';

// Import metadata from a separate file
export { metadata } from './metadata';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize error handler
  if (typeof window !== 'undefined') {
    initializeErrorHandler();
  }
  
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
