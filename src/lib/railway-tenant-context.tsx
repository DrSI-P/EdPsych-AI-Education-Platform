'use client';

// Tenant Context Provider for Railway PostgreSQL Integration
// This file provides tenant management for the EdPsych AI Platform

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRailwayDb } from './railway-provider';

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
  
  // Use try-catch to handle potential session errors
  let userRole = 'student';
  try {
    const { data: session } = useSession();
    userRole = session?.user?.role?.toLowerCase() || 'student';
  } catch (error) {
    console.error('Error accessing session:', error);
    // Fall back to student role if there's an error
  }

  const { db, isLoading: isDbLoading, error: dbError } = useRailwayDb();

  // Function to set the current tenant
  const setCurrentTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    
    // Check if we should skip DB operations based on environment variable
    const skipDbOps = process.env.SKIP_DB_OPERATIONS === 'true';
    if (skipDbOps) {
      console.log('Skipping database operation for setting tenant ID due to SKIP_DB_OPERATIONS=true');
      return;
    }
    
    // Set the tenant ID in database context
    try {
      if (db && typeof db.$executeRaw === 'function') {
        // Using Prisma client
        db.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, false)`
          .then(() => {
            console.log('Successfully set tenant ID in database session');
          })
          .catch((error: unknown) => {
            console.error('Error setting tenant ID in database session:', error);
          });
      } else {
        console.log('Database client not available or does not support raw queries');
      }
    } catch (err: unknown) {
      console.error('Exception when setting tenant ID:', err);
      // Continue without disrupting the UI
    }
  };

  // Initialize tenant based on user session
  useEffect(() => {
    const initializeTenant = async () => {
      if (isDbLoading) {
        return; // Wait for database to initialize
      }
      
      setIsLoading(true);
      
      try {
        // Check if we should skip DB operations based on environment variable
        const skipDbOps = process.env.SKIP_DB_OPERATIONS === 'true';
        const bypassDb = process.env.TENANT_CONTEXT_BYPASS_DB === 'true';
        
        if (skipDbOps || bypassDb || dbError) {
          console.log('Using default tenant due to DB operations being skipped or DB error');
          setCurrentTenantId(defaultTenantId);
          setCurrentTenant(defaultTenantId);
          setIsLoading(false);
          return;
        }
        
        // If user is authenticated, try to get their tenant
        const session = useSession();
        if (session?.data?.user) {
          try {
            // Using Prisma client to query the database
            if (db && typeof db.user === 'object') {
              const userData = await db.user.findUnique({
                where: { id: session.data.user.id },
                select: { tenantId: true }
              });
              
              if (userData?.tenantId) {
                console.log('Successfully retrieved tenant for user');
                setCurrentTenantId(userData.tenantId);
                setCurrentTenant(userData.tenantId);
              } else {
                console.log('No tenant found for user, using default');
                setCurrentTenantId(defaultTenantId);
                setCurrentTenant(defaultTenantId);
                
                // Ensure default tenant exists
                await ensureDefaultTenant();
              }
            } else {
              console.log('Database client not available or does not support user model');
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

    // Helper function to ensure default tenant exists
    const ensureDefaultTenant = async () => {
      if (!db || typeof db.tenant !== 'object') {
        return;
      }
      
      try {
        // Check if default tenant exists
        const defaultTenant = await db.tenant.findUnique({
          where: { id: defaultTenantId }
        });
        
        // If not, create it
        if (!defaultTenant) {
          await db.tenant.create({
            data: {
              id: defaultTenantId,
              name: 'Default Tenant',
              domain: 'edpsychconnect.com',
              updatedAt: new Date()
            }
          });
          console.log('Created default tenant');
        }
      } catch (error) {
        console.error('Error ensuring default tenant exists:', error);
      }
    };

    initializeTenant();
  }, [db, isDbLoading, dbError, defaultTenantId]);

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
    console.error('Tenant error boundary caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default TenantProvider;