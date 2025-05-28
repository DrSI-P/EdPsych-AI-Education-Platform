"use client"

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider(: React.ReactNode { children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider
