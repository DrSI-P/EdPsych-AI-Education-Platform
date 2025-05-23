/**
 * UK Educational Standards Hook for EdPsych AI Education Platform
 * This hook provides utilities for ensuring content aligns with UK standards
 */

'use client';

import { useState, useCallback } from 'react';
import { 
  convertToUKSpelling, 
  validateKeyStageAppropriateContent, 
  checkCurriculumAlignment,
  convertToUKEducationalTerminology,
  KeyStage
} from '@/lib/uk-standards';

interface UKStandardsValidationResult {
  spelling: {
    original: string;
    corrected: string;
    hasChanges: boolean;
  };
  terminology: {
    original: string;
    corrected: string;
    hasChanges: boolean;
  };
  keyStageAppropriate: {
    valid: boolean;
    issues: string[];
  };
  curriculumAlignment: {
    alignmentScore: number;
    suggestions: string[];
  };
  overallCompliance: number; // 0-100 score
}

export function useUKStandards() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<UKStandardsValidationResult | null>(null);

  /**
   * Validate content against UK educational standards
   */
  const validateContent = useCallback(async (
    content: string,
    subject: string,
    keyStage: KeyStage
  ): Promise<UKStandardsValidationResult> => {
    setIsValidating(true);
    
    try {
      // UK spelling check
      const ukSpelling = convertToUKSpelling(content);
      const hasSpellingChanges = ukSpelling !== content;
      
      // UK terminology check
      const ukTerminology = convertToUKEducationalTerminology(ukSpelling);
      const hasTerminologyChanges = ukTerminology !== ukSpelling;
      
      // Key stage appropriateness check
      const keyStageCheck = validateKeyStageAppropriateContent(ukTerminology, keyStage);
      
      // Curriculum alignment check
      const alignmentCheck = checkCurriculumAlignment(ukTerminology, subject, keyStage);
      
      // Calculate overall compliance score
      const spellingScore = hasSpellingChanges ? 50 : 100;
      const terminologyScore = hasTerminologyChanges ? 50 : 100;
      const keyStageScore = keyStageCheck.valid ? 100 : Math.max(0, 100 - (keyStageCheck.issues.length * 20));
      const alignmentScore = alignmentCheck.alignmentScore;
      
      const overallCompliance = Math.round(
        (spellingScore * 0.2) + 
        (terminologyScore * 0.2) + 
        (keyStageScore * 0.3) + 
        (alignmentScore * 0.3)
      );
      
      const result = {
        spelling: {
          original: content,
          corrected: ukSpelling,
          hasChanges: hasSpellingChanges
        },
        terminology: {
          original: ukSpelling,
          corrected: ukTerminology,
          hasChanges: hasTerminologyChanges
        },
        keyStageAppropriate: keyStageCheck,
        curriculumAlignment: alignmentCheck,
        overallCompliance
      };
      
      setValidationResult(result);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, []);

  /**
   * Apply all UK standards corrections to content
   */
  const applyUKStandards = useCallback((content: string): string => {
    const ukSpelling = convertToUKSpelling(content);
    return convertToUKEducationalTerminology(ukSpelling);
  }, []);

  return {
    validateContent,
    applyUKStandards,
    isValidating,
    validationResult
  };
}
