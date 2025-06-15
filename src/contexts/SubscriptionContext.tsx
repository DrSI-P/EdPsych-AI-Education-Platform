import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Types
export interface SubscriptionTier {
  id: string;
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isActive: boolean;
  features: string[];
  maxUsers: number;
  tierType: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tierId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  billingCycle: 'monthly' | 'yearly';
  tier?: SubscriptionTier;
}

export interface Feature {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  creditCost: number | null;
  isActive: boolean;
  hasAccess?: boolean;
}

interface SubscriptionContextType {
  // Subscription data
  activeSubscription: Subscription | null;
  subscriptionHistory: Subscription[];
  creditBalance: number;
  isLoading: boolean;
  error: string | null;
  
  // Available tiers and features
  availableTiers: SubscriptionTier[];
  features: Feature[];
  
  // Actions
  refreshSubscriptionData: () => Promise<void>;
  cancelSubscription: () => Promise<boolean>;
  changeSubscriptionTier: (tierId: string) => Promise<boolean>;
  createCheckoutSession: (tierId: string, billingCycle: 'monthly' | 'yearly') => Promise<string | null>;
  purchaseCredits: (amount: number) => Promise<string | null>;
  useCredits: (featureId: string, amount: number) => Promise<boolean>;
  hasFeatureAccess: (featureId: string) => boolean;
}

// Create context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  activeSubscription: null,
  subscriptionHistory: [],
  creditBalance: 0,
  isLoading: false,
  error: null,
  availableTiers: [],
  features: [],
  refreshSubscriptionData: async () => {},
  cancelSubscription: async () => false,
  changeSubscriptionTier: async () => false,
  createCheckoutSession: async () => null,
  purchaseCredits: async () => null,
  useCredits: async () => false,
  hasFeatureAccess: () => false,
});

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<Subscription[]>([]);
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [availableTiers, setAvailableTiers] = useState<SubscriptionTier[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get the access token
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  // Fetch subscription data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscriptionData();
      fetchTiers();
      fetchFeatures();
    }
  }, [isAuthenticated]);

  // Fetch user subscription data
  const refreshSubscriptionData = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No access token found');
      }
      
      const response = await fetch('/api/subscriptions/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setActiveSubscription(data.data.activeSubscription);
        setSubscriptionHistory(data.data.subscriptionHistory);
        setCreditBalance(data.data.creditBalance);
      } else {
        setError(data.message || 'Failed to fetch subscription data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching subscription data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available subscription tiers
  const fetchTiers = async (): Promise<void> => {
    try {
      const response = await fetch('/api/subscriptions/tiers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription tiers');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAvailableTiers(data.data);
      }
    } catch (err) {
      console.error('Error fetching subscription tiers:', err);
    }
  };

  // Fetch features
  const fetchFeatures = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No access token found');
      }
      
      const response = await fetch('/api/subscriptions/features', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch features');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFeatures(data.data);
      }
    } catch (err) {
      console.error('Error fetching features:', err);
    }
  };

  // Cancel subscription
  const cancelSubscription = async (): Promise<boolean> => {
    if (!isAuthenticated || !activeSubscription) return false;
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No access token found');
      }
      
      const response = await fetch('/api/subscriptions/user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
      
      const data = await response.json();
      
      if (data.success) {
        await refreshSubscriptionData();
        return true;
      } else {
        setError(data.message || 'Failed to cancel subscription');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error canceling subscription:', err);
      return false;
    }
  };

  // Change subscription tier
  const changeSubscriptionTier = async (tierId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No access token found');
      }
      
      const response = await fetch('/api/subscriptions/user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'change_tier',
          tierId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to change subscription tier');
      }
      
      const data = await response.json();
      
      if (data.success) {
        await refreshSubscriptionData();
        return true;
      } else {
        setError(data.message || 'Failed to change subscription tier');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error changing subscription tier:', err);
      return false;
    }
  };

  // Create checkout session
  const createCheckoutSession = async (tierId: string, billingCycle: 'monthly' | 'yearly'): Promise<string | null> => {
    if (!isAuthenticated) return null;
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No access token found');
      }
      
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierId,
          billingCycle,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
      
      const data = await response.json();
      
      if (data.success && data.data.checkoutUrl) {
        return data.data.checkoutUrl;
      } else {
        setError(data.message || 'Failed to create checkout session');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating checkout session:', err);
      return null;
    }
  };

  // Purchase credits
  const purchaseCredits = async (amount: number): Promise<string | null> => {
    if (!isAuthenticated) return null;
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No access token found');
      }
      
      const response = await fetch('/api/subscriptions/credits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'purchase',
          amount,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to purchase credits');
      }
      
      const data = await response.json();
      
      if (data.success && data.data.checkoutUrl) {
        return data.data.checkoutUrl;
      } else {
        setError(data.message || 'Failed to purchase credits');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error purchasing credits:', err);
      return null;
    }
  };

  // Use credits
  const useCredits = async (featureId: string, amount: number): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No access token found');
      }
      
      const response = await fetch('/api/subscriptions/credits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'use',
          featureId,
          amount,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to use credits');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update credit balance
        setCreditBalance(prev => prev - amount);
        return true;
      } else {
        setError(data.message || 'Failed to use credits');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error using credits:', err);
      return false;
    }
  };

  // Check if user has access to a feature
  const hasFeatureAccess = (featureId: string): boolean => {
    // Check in features array first (this includes access info from the API)
    const feature = features.find(f => f.id === featureId);
    if (feature && feature.hasAccess !== undefined) {
      return feature.hasAccess;
    }
    
    // If not found or hasAccess is undefined, check subscription tier features
    if (activeSubscription?.tier?.features) {
      return (activeSubscription.tier.features as string[]).includes(featureId);
    }
    
    return false;
  };

  const value = {
    activeSubscription,
    subscriptionHistory,
    creditBalance,
    isLoading,
    error,
    availableTiers,
    features,
    refreshSubscriptionData,
    cancelSubscription,
    changeSubscriptionTier,
    createCheckoutSession,
    purchaseCredits,
    useCredits,
    hasFeatureAccess,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook to use the subscription context
export const useSubscription = () => useContext(SubscriptionContext);

export default SubscriptionContext;