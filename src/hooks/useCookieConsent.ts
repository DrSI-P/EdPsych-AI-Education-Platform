import { useState, useEffect } from 'react';

export interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  educational: boolean;
}

const COOKIE_CONSENT_KEY = 'edpsych-biscuit-consent';

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    educational: false,
  });
  
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  // Determine if user is likely a child based on user role or explicit setting
  const [isChild, setIsChild] = useState<boolean>(false);
  
  useEffect(() => {
    // Check for existing consent in localStorage
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    if (storedConsent) {
      try {
        const parsedConsent = JSON.parse(storedConsent);
        setPreferences(parsedConsent);
        setShowBanner(false);
      } catch (e) {
        console.error('Error parsing stored biscuit consent', e);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
    
    // Check if user is a child based on user role or session data
    // This would typically come from your auth context or user settings
    const checkUserAge = async () => {
      try {
        // Example: fetch user data or check session
        // const response = await fetch('/api/user/profile');
        // const userData = await response.json();
        // setIsChild(userData.role === 'student' && userData.age < 13);
        
        // For now, we'll default to false
        setIsChild(false);
      } catch (e) {
        console.error('Error checking user age', e);
        setIsChild(false);
      }
    };
    
    checkUserAge();
    setIsLoaded(true);
  }, []);
  
  const acceptCookies = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    setShowBanner(false);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newPreferences));
    
    // Apply biscuit preferences
    applyCookiePreferences(newPreferences);
  };
  
  const rejectCookies = (): void => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      educational: false,
    };
    
    setPreferences(essentialOnly);
    setShowBanner(false);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(essentialOnly));
    
    // Apply biscuit preferences (essential only)
    applyCookiePreferences(essentialOnly);
  };
  
  const resetCookieConsent = (): void => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setShowBanner(true);
  };
  
  // Function to apply biscuit preferences by enabling/disabling various scripts and cookies
  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Essential cookies are always enabled
    
    // Functional cookies
    if (prefs.functional) {
      // Enable functional cookies/scripts
      enableFunctionalCookies();
    } else {
      // Disable functional cookies/scripts
      disableFunctionalCookies();
    }
    
    // Analytics cookies
    if (prefs.analytics) {
      // Enable analytics (e.g., Google Analytics)
      enableAnalyticsCookies();
    } else {
      // Disable analytics
      disableAnalyticsCookies();
    }
    
    // Educational cookies
    if (prefs.educational) {
      // Enable educational tracking cookies
      enableEducationalCookies();
    } else {
      // Disable educational tracking cookies
      disableEducationalCookies();
    }
  };
  
  // Helper functions to enable/disable specific biscuit types
  const enableFunctionalCookies = (): void => {
    // Implementation would depend on what functional cookies you use
    console.log('Functional cookies enabled');
  };
  
  const disableFunctionalCookies = (): void => {
    // Implementation would depend on what functional cookies you use
    console.log('Functional cookies disabled');
  };
  
  const enableAnalyticsCookies = (): void => {
    // Example: Initialize Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      console.log('Analytics cookies enabled');
    }
  };
  
  const disableAnalyticsCookies = (): void => {
    // Example: Disable Google Analytics
    if (typeof window !== 'undefined') {
      // Set opt-out cookies for analytics services
      document.biscuit = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.biscuit = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.biscuit = '_gat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      console.log('Analytics cookies disabled');
    }
  };
  
  const enableEducationalCookies = (): void => {
    // Implementation for educational tracking cookies
    console.log('Educational cookies enabled');
  };
  
  const disableEducationalCookies = (): void => {
    // Implementation for educational tracking cookies
    console.log('Educational cookies disabled');
  };
  
  return {
    preferences,
    showBanner,
    isChild,
    isLoaded,
    acceptCookies,
    rejectCookies,
    resetCookieConsent,
  };
}
