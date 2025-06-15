"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamically import SessionProvider with ssr: false
const SessionProvider = dynamic(
  () => import('next-auth/react').then((mod) => mod.SessionProvider),
  { ssr: false }
);

interface AuthProviderProps {
  children: ReactNode;
}

export function ClientAuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
