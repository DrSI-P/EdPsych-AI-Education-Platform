import React from 'react';
import { useFeatureRecommendations } from '@/hooks/useFeatureRecommendations';
import { CreditFeatureGate } from './FeatureGate';

interface FeatureRecommendationsProps {
  /**
   * The maximum number of recommendations to display
   */
  limit?: number;
  
  /**
   * The title to display above the recommendations
   */
  title?: string;
  
  /**
   * Whether to show the recommendations in a compact layout
   */
  compact?: boolean;
  
  /**
   * Optional callback when a recommendation is clicked
   */
  onRecommendationClick?: (featureId: string) => void;
}

/**
 * A component that displays personalized feature recommendations
 */
export function FeatureRecommendations({
  limit = 3,
  title = 'Recommended for You',
  compact = false,
  onRecommendationClick,
}: FeatureRecommendationsProps) {
  const { recommendations, isLoading, error } = useFeatureRecommendations(limit);

  if (isLoading) {
    return (
      <div className="animate-pulse p-4 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (recommendations.length === 0) {
    return null; // Don't show anything if there are no recommendations
  }

  return (
    <div className={`${compact ? 'p-2' : 'p-4'}`}>
      <h3 className={`${compact ? 'text-md' : 'text-lg'} font-medium text-gray-900 mb-2`}>
        {title}
      </h3>
      <div className="space-y-2">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.featureId}
            recommendation={recommendation}
            compact={compact}
            onClick={() => onRecommendationClick?.(recommendation.featureId)}
          />
        ))}
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  /**
   * The recommendation to display
   */
  recommendation: {
    featureId: string;
    name: string;
    description: string;
    creditCost: number | null;
    score: number;
    reason: string;
  };
  
  /**
   * Whether to show the card in a compact layout
   */
  compact?: boolean;
  
  /**
   * Optional callback when the card is clicked
   */
  onClick?: () => void;
}

/**
 * A card that displays a feature recommendation
 */
function RecommendationCard({
  recommendation,
  compact = false,
  onClick,
}: RecommendationCardProps) {
  const { featureId, name, description, creditCost, reason } = recommendation;
  
  return (
    <div 
      className={`
        bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow
        ${compact ? 'p-2' : 'p-4'}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className={`${compact ? 'text-sm' : 'text-md'} font-medium text-gray-900`}>
            {name}
          </h4>
          {!compact && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
          <p className={`${compact ? 'text-xs mt-1' : 'text-sm mt-2'} text-indigo-600`}>
            {reason}
          </p>
        </div>
        {creditCost !== null && (
          <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
            {creditCost} credits
          </div>
        )}
      </div>
      
      {!compact && (
        <div className="mt-3">
          <TryFeatureButton featureId={featureId} />
        </div>
      )}
    </div>
  );
}

interface TryFeatureButtonProps {
  /**
   * The ID of the feature to try
   */
  featureId: string;
}

/**
 * A button that allows the user to try a feature
 */
function TryFeatureButton({ featureId }: TryFeatureButtonProps) {
  const [creditResult, setCreditResult] = React.useState<string | null>(null);

  // Handle credit usage result
  const handleCreditUse = (result: { success: boolean; remainingCredits?: number }) => {
    if (result.success) {
      setCreditResult(`Success! You have ${result.remainingCredits} credits remaining.`);
    } else {
      setCreditResult('Failed to use credits.');
    }
  };

  return (
    <>
      {creditResult && (
        <div className="mb-2 text-xs text-green-600">
          {creditResult}
        </div>
      )}
      
      <CreditFeatureGate
        feature={featureId}
        onCreditUse={handleCreditUse}
        renderNothing={false}
        fallback={
          <button
            className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try This Feature
          </button>
        }
      >
        <div className="text-center text-sm text-green-600">
          Feature unlocked! You can now use this feature.
        </div>
      </CreditFeatureGate>
    </>
  );
}