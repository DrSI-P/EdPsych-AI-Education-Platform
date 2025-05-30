'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { VoiceInputProvider } from '@/components/VoiceInput';
import GlobalVoiceInput from '@/components/voice-input/global-voice-input';
import AccessibilityControls from '@/components/ui/AccessibilityControls';
import { useSession } from 'next-auth/react';

/**
 * Root Layout Wrapper Component
 * 
 * This component should be added to the root layout to provide:
 * 1. Voice input capabilities through a global floating component
 * 2. Accessibility controls for font size, contrast, motion, etc.
 * 3. Integration between voice input and accessibility features
 * 
 * It ensures these features are consistently available throughout the application
 * and are properly adapted to the user's needs and preferences.
 */
export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Determine if we should show the voice input on this page
  // Exclude it from pages where it might interfere with specialised voice interfaces
  const shouldShowVoiceInput = !pathname.includes('/voice-input-test');
  
  // Determine user age group based on session data if available
  const getUserAgeGroup = () => {
    if (!session?.user) return 'late-primary'; // Default
    
    // In a real implementation, this would use actual user data
    // For now, we'll use a simple mapping based on role
    const role = session.user.role;
    if (role === 'STUDENT') {
      const yearGroup = session.user.yearGroup;
      if (yearGroup <= 2) return 'nursery';
      if (yearGroup <= 5) return 'early-primary';
      if (yearGroup <= 8) return 'late-primary';
      return 'secondary';
    }
    
    return 'secondary'; // Default for non-students
  };
  
  return (
    <VoiceInputProvider initialAgeGroup={getUserAgeGroup()}>
      {children}
      
      {/* Global accessibility controls */}
      <AccessibilityControls 
        position="bottom-right"
        initialFontSize={16}
        initialContrast="normal"
        initialReduceMotion={false}
        initialDyslexicFont={false}
      />
      
      {/* Global voice input component */}
      {shouldShowVoiceInput && <GlobalVoiceInput />}
    </VoiceInputProvider>
  );
}

export default RootLayoutWrapper;
