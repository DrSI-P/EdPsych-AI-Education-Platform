"use client";

import React from 'react';
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import dynamic from "next/dynamic";

// Dynamically import SessionProvider to prevent SSR issues
const SessionProvider = dynamic(() => import('next-auth/react').then(mod => mod.SessionProvider), {
  ssr: false,
});

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider
