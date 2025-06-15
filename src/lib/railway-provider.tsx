"use client";

import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PrismaClient } from '@prisma/client';

// Create a context for the Railway database client
type RailwayDbContext = {
  db: unknown | null; // Using any type for flexibility
  isLoading: boolean;
  error: Error | null;
};

const RailwayDbContext = createContext<RailwayDbContext>({
  db: null,
  isLoading: true,
  error: null,
});

// Hook to use the Railway database context
export const useRailwayDb = (): RailwayDbContext => {
  const context = useContext(RailwayDbContext);
  if (context === undefined) {
    throw new Error('useRailwayDb must be used within a RailwayDbProvider');
  }
  return context;
};

// Provider component
export function RailwayDbProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Check if we should skip DB operations based on environment variable
        const skipDbOps = process.env.SKIP_DB_OPERATIONS === 'true';
        const bypassDb = process.env.TENANT_CONTEXT_BYPASS_DB === 'true';
        
        if (skipDbOps || bypassDb) {
          console.log('Skipping database initialization due to DB operations being disabled');
          // Create a mock client that won't actually connect to the database
          const mockClient = {
            // Mock methods as needed
            query: async () => ({ rows: [] }),
            // Add other mock methods as needed
          };
          setDb(mockClient);
          setIsLoading(false);
          return;
        }
        
        // In client components, we need to use NEXT_PUBLIC_ prefixed environment variables
        // or fetch the database configuration from an API endpoint
        let databaseUrl;
        
        try {
          // Try to fetch database configuration from an API endpoint
          const response = await fetch('/api/db-config');
          if (response.ok) {
            const data = await response.json();
            databaseUrl = data.databaseUrl;
            console.log('Successfully fetched database configuration from API');
          } else {
            // Fallback to public environment variable if API fails
            databaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
            console.log('Using public environment variable for database connection');
          }
        } catch (fetchError) {
          console.error('Error fetching database configuration:', fetchError);
          // Fallback to public environment variable
          databaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
        }
        
        if (!databaseUrl) {
          console.error('Database URL not found in environment variables or API');
          
          // Create a mock client as a fallback
          const mockClient = {
            // Mock methods as needed
            query: async () => ({ rows: [] }),
            // Add other mock methods as needed
          };
          setDb(mockClient);
          setError(new Error('Database configuration missing. Using mock client.'));
          setIsLoading(false);
          return;
        }
        
        // Initialize Prisma client (or other database client)
        // Note: In a real application, you would typically use a singleton pattern
        // for the Prisma client rather than creating it in a React component
        try {
          // This is a simplified example - in a real app, you'd use a proper
          // singleton pattern for the Prisma client
          const prisma = new PrismaClient();
          
          // Test the connection
          await prisma.$connect();
          console.log('Railway PostgreSQL connection successful');
          
          setDb(prisma);
        } catch (connectionError) {
          console.error('Error connecting to Railway PostgreSQL:', connectionError);
          
          // Create a mock client as a fallback
          const mockClient = {
            // Mock methods as needed
            query: async () => ({ rows: [] }),
            // Add other mock methods as needed
          };
          setDb(mockClient);
          setError(new Error('Failed to connect to database. Using mock client.'));
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing database client:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing database'));
        
        // Create a mock client as a fallback
        const mockClient = {
          // Mock methods as needed
          query: async () => ({ rows: [] }),
          // Add other mock methods as needed
        };
        setDb(mockClient);
        console.log('Using mock database client due to initialization error');
        
        setIsLoading(false);
      }
    };

    initializeDatabase();
    
    // Cleanup function
    return () => {
      // Close database connection if needed
      if (db && typeof db.$disconnect === 'function') {
        db.$disconnect();
      }
    };
  }, []);

  return (
    <RailwayDbContext.Provider value={{ db, isLoading, error }}>
      {children}
    </RailwayDbContext.Provider>
  );
}

export default RailwayDbProvider;