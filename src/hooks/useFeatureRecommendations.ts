"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface FeatureRecommendation {
  featureId: string;
  name: string;
  description: string;
  creditCost: number | null;
  score: number;
  reason: string;
}

interface UseFeatureRecommendationsResult {
  recommendations: FeatureRecommendation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to get personalized feature recommendations for the current user
 * @param limit The maximum number of recommendations to return
 * @returns An object with recommendations, loading state, and error information
 */
export function useFeatureRecommendations(limit: number = 5): UseFeatureRecommendationsResult {
  const { data: session, status } = useSession();
  const [recommendations, setRecommendations] = useState<FeatureRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/features/recommendations?limit=${limit}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching feature recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [status, limit]);

  return {
    recommendations,
    isLoading,
    error,
    refetch: fetchRecommendations,
  };
}