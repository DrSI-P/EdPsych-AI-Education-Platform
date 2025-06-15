'use client';

// Simplified Tenant Context Provider for Railway Integration
// This file provides a minimal tenant management solution that doesn't rely on database models

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

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

  // Function to set the current tenant
  const setCurrentTenant = async (tenantId: string) => {
    console.log('[TenantProvider] Setting current tenant ID:', tenantId);
    setCurrentTenantId(tenantId);
    
    try {
      // Store the tenant ID in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentTenantId', tenantId);
        console.log('[TenantProvider] Stored tenant ID in localStorage');
      }
    } catch (err) {
      console.error('[TenantProvider] Error storing tenant ID:', err);
    }
  };

  // Initialize tenant based on user session or localStorage
  useEffect(() => {
    const initializeTenant = async () => {
      console.log('[TenantProvider] Initializing tenant...');
      setIsLoading(true);
      
      try {
        // First try to get tenant ID from localStorage
        let tenantId = defaultTenantId;
        
        if (typeof window !== 'undefined') {
          const storedTenantId = localStorage.getItem('currentTenantId');
          if (storedTenantId) {
            console.log('[TenantProvider] Found tenant ID in localStorage:', storedTenantId);
            tenantId = storedTenantId;
          }
        }
        
        // Set the tenant ID
        console.log('[TenantProvider] Using tenant ID:', tenantId);
        setCurrentTenantId(tenantId);
        
        // No need to call setCurrentTenant here as it would create an infinite loop
        // Just set the state directly
      } catch (err) {
        console.error('[TenantProvider] Error initializing tenant:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing tenant'));
        
        // Fall back to default tenant on error
        setCurrentTenantId(defaultTenantId);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTenant();
  }, [defaultTenantId]);

  // Log when the session changes
  useEffect(() => {
    console.log('[TenantProvider] Session changed:', session ? 'authenticated' : 'unauthenticated');
  }, [session]);

  return (
    <TenantContext.Provider value={{ currentTenantId, setCurrentTenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
};

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
    console.error('[TenantErrorBoundary] Caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}