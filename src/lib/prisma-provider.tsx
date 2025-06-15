"use client";

import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { prisma } from './prisma-client';

// Create a context for the Prisma client
type PrismaContextType = {
  isLoading: boolean;
  error: Error | null;
};

const PrismaContext = createContext<PrismaContextType>({
  isLoading: true,
  error: null,
});

// Hook to use the Prisma context
export const usePrisma = (): void => {
  const context = useContext(PrismaContext);
  if (context === undefined) {
    throw new Error('usePrisma must be used within a PrismaProvider');
  }
  return context;
};

// Provider component
export function PrismaProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializePrisma = async () => {
      try {
        // Verify Prisma connection by making a simple query
        await prisma.$queryRaw`SELECT 1 as test`;
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Prisma client:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing Prisma'));
        setIsLoading(false);
      }
    };

    initializePrisma();

    // Clean up function
    return () => {
      // No need to disconnect in component as prisma is a singleton
    };
  }, []);

  return (
    <PrismaContext.Provider value={{ isLoading, error }}>
      {children}
    </PrismaContext.Provider>
  );
}

export default PrismaProvider;