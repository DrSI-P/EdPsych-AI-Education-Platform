'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Multi-tenant context and provider for the EdPsych Connect platform
 * 
 * This module provides the core infrastructure for multi-tenant functionality,
 * including tenant identification, data isolation, and tenant-specific configuration.
 */

// Define tenant types
export enum TenantType {
  SCHOOL = 'school',
  DISTRICT = 'district',
  ORGANIZATION = 'organization',
  INDEPENDENT = 'independent'
}

// Define tenant subscription tiers
export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

// Define tenant configuration interface
export interface TenantConfig {
  id: string;
  name: string;
  type: TenantType;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
  domains: string[];
  features: {
    [key: string]: boolean;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl: string;
    faviconUrl: string;
  };
  settings: {
    [key: string]: any;
  };
}

// Define tenant user role types
export enum TenantRole {
  ADMIN = 'admin',
  EDUCATOR = 'educator',
  STUDENT = 'student',
  PARENT = 'parent',
  GUEST = 'guest'
}

// Define tenant user interface
export interface TenantUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: TenantRole;
  permissions: string[];
  settings: {
    [key: string]: any;
  };
}

// Define tenant context interface
interface TenantContextType {
  currentTenant: TenantConfig | null;
  currentUser: TenantUser | null;
  isLoading: boolean;
  error: Error | null;
  switchTenant: (tenantId: string) => Promise<void>;
  updateTenantConfig: (config: Partial<TenantConfig>) => Promise<void>;
  isTenantFeatureEnabled: (featureKey: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Create tenant context with default undefined value
const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Create tenant provider props interface
interface TenantProviderProps {
  children: ReactNode;
  initialTenantId?: string;
}

// Simulate API call with delay
function simulateApiCall(delay: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Mock function to fetch tenant configuration
async function fetchTenantConfig(tenantId: string): Promise<TenantConfig> {
  // In a real implementation, this would be an API call
  // For now, we'll return mock data
  return {
    id: tenantId,
    name: `Tenant ${tenantId}`,
    type: TenantType.SCHOOL,
    subscriptionTier: SubscriptionTier.STANDARD,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-05-01T00:00:00Z',
    domains: [`tenant-${tenantId}.edpsychconnect.com`],
    features: {
      advancedAnalytics: true,
      collaborativeLearning: true,
      parentPortal: true,
      aiTutoring: true,
      customCurriculum: false
    },
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#FBBF24',
      logoUrl: `/assets/tenants/${tenantId}/logo.png`,
      faviconUrl: `/assets/tenants/${tenantId}/favicon.ico`
    },
    settings: {
      defaultLanguage: 'en-GB',
      timeZone: 'Europe/London',
      academicYear: '2025-2026'
    }
  };
}

// Mock function to fetch current tenant user
async function fetchCurrentTenantUser(tenantId: string): Promise<TenantUser> {
  // In a real implementation, this would be an API call
  // For now, we'll return mock data
  return {
    id: 'user-1',
    tenantId,
    email: 'user@example.com',
    name: 'Test User',
    role: TenantRole.EDUCATOR,
    permissions: [
      'view:students',
      'edit:students',
      'view:classes',
      'edit:classes',
      'view:curriculum',
      'edit:curriculum'
    ],
    settings: {
      theme: 'light',
      notifications: {
        email: true,
        push: true
      }
    }
  };
}

// Create tenant provider component
export function TenantProvider(props: TenantProviderProps): JSX.Element {
  const { children, initialTenantId } = props;
  
  const [currentTenant, setCurrentTenant] = useState<TenantConfig | null>(null);
  const [currentUser, setCurrentUser] = useState<TenantUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load tenant data on mount or when initialTenantId changes
  useEffect(() => {
    async function loadTenantData() {
      if (!initialTenantId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate the response
        await simulateApiCall(500);

        // Get tenant config
        const tenantConfig = await fetchTenantConfig(initialTenantId);
        setCurrentTenant(tenantConfig);

        // Get current user for this tenant
        const user = await fetchCurrentTenantUser(initialTenantId);
        setCurrentUser(user);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error loading tenant data'));
        console.error('Error loading tenant data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTenantData();
  }, [initialTenantId]);

  // Switch to a different tenant
  const switchTenant = async (tenantId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate the response
      await simulateApiCall(500);

      // Get tenant config
      const tenantConfig = await fetchTenantConfig(tenantId);
      setCurrentTenant(tenantConfig);

      // Get current user for this tenant
      const user = await fetchCurrentTenantUser(tenantId);
      setCurrentUser(user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error switching tenant'));
      console.error('Error switching tenant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update tenant configuration
  const updateTenantConfig = async (config: Partial<TenantConfig>) => {
    if (!currentTenant) {
      throw new Error('No tenant selected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate the response
      await simulateApiCall(500);

      // Update tenant config
      const updatedConfig = {
        ...currentTenant,
        ...config,
        updatedAt: new Date().toISOString()
      };

      setCurrentTenant(updatedConfig);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error updating tenant config'));
      console.error('Error updating tenant config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a tenant feature is enabled
  const isTenantFeatureEnabled = (featureKey: string) => {
    if (!currentTenant) {
      return false;
    }

    return !!currentTenant.features[featureKey];
  };

  // Check if the current user has a specific permission
  const hasPermission = (permission: string) => {
    if (!currentUser) {
      return false;
    }

    return currentUser.permissions.includes(permission);
  };

  // Create context value
  const contextValue: TenantContextType = {
    currentTenant,
    currentUser,
    isLoading,
    error,
    switchTenant,
    updateTenantConfig,
    isTenantFeatureEnabled,
    hasPermission
  };

  // Return the provider component with context value
  return React.createElement(
    TenantContext.Provider,
    { value: contextValue },
    children
  );
}

// Create hook for using tenant context
export function useTenant(): TenantContextType {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
