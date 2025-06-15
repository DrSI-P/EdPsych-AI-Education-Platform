"use client";

// TODO: Review Supabase usage and migrate to Railway
// Tenant Context Provider for Supabase Integration
// This file provides a solution for the "Tenant or user not found" error

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// Define the tenant context type
interface TenantContextType {
  currentTenantId: string | null;
  setCurrentTenant: (tenantId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

// Create the context with default values
const TenantContext = createContext<TenantContextType>({
  currentTenantId: null,
  setCurrentTenant: () => {},
  isLoading: true,
  error: null,
});

// Hook for components to access the tenant context
export const useTenant = () => useContext(TenantContext);

interface TenantProviderProps {
  children: ReactNode;
  defaultTenantId?: string;
}

export const TenantProvider = ({ 
  children, 
  defaultTenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || 'debdcb9f-f3d3-4dc5-8000-000000000000'
}: TenantProviderProps) => {
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(defaultTenantId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data: session } = useSession();
  const supabase = useSupabaseClient();

  // Function to set the current tenant
  const setCurrentTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    
    // Check if we should skip DB operations based on environment variable
    const skipDbOps = process.env.SKIP_DB_OPERATIONS === 'true';
    if (skipDbOps) {
      console.log('Skipping database operation for setting tenant ID due to SKIP_DB_OPERATIONS=true');
      return;
    }
    
    // Set the tenant ID in Supabase RLS policies
    try {
      supabase.rpc('set_tenant_id', { tenant_id: tenantId })
        .then(({ error }) => {
          if (error) {
            console.error('Error setting tenant ID:', error);
            // Don't set error state for this operation to prevent UI disruption
            // Just log the error for debugging
          } else {
            console.log('Successfully set tenant ID in RLS policies');
          }
        });
    } catch (err: unknown) {
      console.error('Exception when setting tenant ID:', err);
      // Continue without disrupting the UI
    }
  };

  // Initialize tenant based on user session
  useEffect(() => {
    const initializeTenant = async () => {
      setIsLoading(true);
      
      try {
        // Check if we should skip DB operations based on environment variable
        const skipDbOps = process.env.SKIP_DB_OPERATIONS === 'true';
        const bypassDb = process.env.TENANT_CONTEXT_BYPASS_DB === 'true';
        
        if (skipDbOps || bypassDb) {
          console.log('Using default tenant due to DB operations being skipped');
          setCurrentTenantId(defaultTenantId);
          setCurrentTenant(defaultTenantId);
          return;
        }
        
        // If user is authenticated, try to get their tenant
        if (session?.user) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('User')
              .select('tenantId')
              .eq('id', session.user.id)
              .single();
            
            if (userError) {
              // If there's an error, check if it's because the tenant doesn't exist
              if (userError.message.includes('Tenant or user not found')) {
                console.log('Tenant or user not found, creating default tenant');
                
                try {
                  // Create default tenant if it doesn't exist
                  await supabase.rpc('ensure_default_tenant');
                  
                  // Try again after creating default tenant
                  const { data: retryData, error: retryError } = await supabase
                    .from('User')
                    .select('tenantId')
                    .eq('id', session.user.id)
                    .single();
                  
                  if (retryError) {
                    console.error('Failed to get user tenant after retry:', retryError);
                    // Fall back to default tenant
                    setCurrentTenantId(defaultTenantId);
                    setCurrentTenant(defaultTenantId);
                  } else if (retryData?.tenantId) {
                    console.log('Successfully retrieved tenant after retry');
                    setCurrentTenantId(retryData.tenantId);
                    setCurrentTenant(retryData.tenantId);
                  } else {
                    console.log('No tenant found after retry, using default');
                    setCurrentTenantId(defaultTenantId);
                    setCurrentTenant(defaultTenantId);
                  }
                } catch (rpcError) {
                  console.error('Error creating default tenant:', rpcError);
                  // Fall back to default tenant
                  setCurrentTenantId(defaultTenantId);
                  setCurrentTenant(defaultTenantId);
                }
              } else {
                console.error('Error getting user tenant:', userError);
                // Fall back to default tenant
                setCurrentTenantId(defaultTenantId);
                setCurrentTenant(defaultTenantId);
              }
            } else if (userData?.tenantId) {
              console.log('Successfully retrieved tenant for user');
              setCurrentTenantId(userData.tenantId);
              setCurrentTenant(userData.tenantId);
            } else {
              console.log('No tenant found for user, using default');
              setCurrentTenantId(defaultTenantId);
              setCurrentTenant(defaultTenantId);
            }
          } catch (dbError) {
            console.error('Database error when getting user tenant:', dbError);
            // Fall back to default tenant
            setCurrentTenantId(defaultTenantId);
            setCurrentTenant(defaultTenantId);
          }
        } else {
          // For unauthenticated users, use default tenant
          console.log('User not authenticated, using default tenant');
          setCurrentTenantId(defaultTenantId);
          setCurrentTenant(defaultTenantId);
        }
      } catch (err) {
        console.error('Error initializing tenant:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing tenant'));
        
        // Fall back to default tenant on error
        setCurrentTenantId(defaultTenantId);
        setCurrentTenant(defaultTenantId);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTenant();
  }, [session, supabase, defaultTenantId]);

  return (
    <TenantContext.Provider value={{ currentTenantId, setCurrentTenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
};

// Create a stored procedure in Supabase to ensure default tenant exists
/*
-- Run this in Supabase SQL Editor:
CREATE OR REPLACE FUNCTION ensure_default_tenant()
RETURNS void AS $$
BEGIN
  INSERT INTO "Tenant" ("id", "name", "domain", "updatedAt")
  VALUES ('debdcb9f-f3d3-4dc5-8000-000000000000', 'Default Tenant', 'edpsychconnect.com', CURRENT_TIMESTAMP)
  ON CONFLICT ("id") DO NOTHING;
END;
$$ LANGUAGE plpgsql;
*/

// HOC to wrap components that need tenant context
export function withTenant<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const tenant = useTenant();
    
    if (tenant.isLoading) {
      return <div>Loading tenant context...</div>;
    }
    
    if (tenant.error) {
      return <div>Error loading tenant: {tenant.error.message}</div>;
    }
    
    return <Component {...props} />;
  };
}

// Error boundary for tenant-related errors
export class TenantErrorBoundary extends React.Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Tenant error boundary caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
