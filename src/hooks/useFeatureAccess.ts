"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface FeatureAccessResult {
  hasAccess: boolean;
  requiresCredits: boolean;
  creditCost: number | null;
  reason: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to check if the current user has access to a specific feature
 * @param featureName The name of the feature to check access for
 * @returns An object with access status, loading state, and error information
 */
export function useFeatureAccess(featureName: string): FeatureAccessResult {
  const { data: session, status } = useSession();
  const [result, setResult] = useState<FeatureAccessResult>({
    hasAccess: false,
    requiresCredits: false,
    creditCost: null,
    reason: '',
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Reset loading state when feature name changes
    setResult(prev => ({ ...prev, isLoading: true, error: null }));
    
    async function checkAccess() {
      // If not authenticated, no access
      if (status === 'unauthenticated') {
        setResult({
          hasAccess: false,
          requiresCredits: false,
          creditCost: null,
          reason: 'Authentication required',
          isLoading: false,
          error: null,
        });
        return;
      }

      // If still loading session, wait
      if (status === 'loading') {
        return;
      }

      try {
        const response = await fetch(`/api/features/check-access?feature=${featureName}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to check feature access');
        }

        const data = await response.json();
        
        setResult({
          hasAccess: data.hasAccess,
          requiresCredits: data.requiresCredits,
          creditCost: data.creditCost,
          reason: data.reason,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setResult({
          hasAccess: false,
          requiresCredits: false,
          creditCost: null,
          reason: '',
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    checkAccess();
  }, [featureName, status]);

  return result;
}

/**
 * Hook to use credits for a specific feature
 * @param featureName The name of the feature to use credits for
 * @returns An object with functions to use credits and the result
 */
export function useCredits(featureName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    remainingCredits?: number;
  } | null>(null);

  const useCredits = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/credits/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featureName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to use credits');
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    useCredits,
    isLoading,
    error,
    result,
  };
}