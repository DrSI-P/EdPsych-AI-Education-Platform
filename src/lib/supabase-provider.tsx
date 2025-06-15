"use client";

import React from 'react';
// TODO: Review Supabase usage and migrate to Railway
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create a context for the Supabase client
type SupabaseContext = {
  supabase: SupabaseClient | null;
  isLoading: boolean;
  error: Error | null;
};

const SupabaseContext = createContext<SupabaseContext>({
  supabase: null,
  isLoading: true,
  error: null,
});

// Hook to use the Supabase context
export const useSupabase = (): void => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

// Provider component
export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Check if we should skip DB operations based on environment variable
        const skipDbOps = process.env.SKIP_DB_OPERATIONS === 'true';
        const bypassDb = process.env.TENANT_CONTEXT_BYPASS_DB === 'true';
        
        if (skipDbOps || bypassDb) {
          console.log('Skipping Supabase initialization due to DB operations being disabled');
          // Create a mock client that won't actually connect to Supabase
          // This prevents errors when DB operations are disabled
          const mockClient = createClient(
            'https://placeholder-url.supabase.co',
            'placeholder-key'
          );
          setSupabase(mockClient);
          setIsLoading(false);
          return;
        }
        
        // Use environment variables for Supabase URL and anon key
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey) {
          console.error('Supabase URL or anon key not found in environment variables');
          
          // Create a mock client as a fallback
          const mockClient = createClient(
            'https://placeholder-url.supabase.co',
            'placeholder-key'
          );
          setSupabase(mockClient);
          setError(new Error('Supabase configuration missing. Using mock client.'));
          setIsLoading(false);
          return;
        }
        
        // Create the Supabase client
        const client = createClient(supabaseUrl, supabaseAnonKey);
        
        // Test the connection
        try {
          await client.auth.getSession();
          console.log('Supabase connection successful');
        } catch (connectionError) {
          console.error('Error connecting to Supabase:', connectionError);
          // Continue with the client anyway, as some features might still work
        }
        
        setSupabase(client);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Supabase client:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing Supabase'));
        
        // Create a mock client as a fallback
        try {
          const mockClient = createClient(
            'https://placeholder-url.supabase.co',
            'placeholder-key'
          );
          setSupabase(mockClient);
          console.log('Using mock Supabase client due to initialization error');
        } catch (mockError) {
          console.error('Error creating mock Supabase client:', mockError);
        }
        
        setIsLoading(false);
      }
    };

    initializeSupabase();
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, isLoading, error }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export default SupabaseProvider;