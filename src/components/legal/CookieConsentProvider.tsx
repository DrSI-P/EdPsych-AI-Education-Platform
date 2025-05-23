import React from 'react';
import { CookieConsentBanner } from '@/components/legal/CookieConsentBanner';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const {
    preferences,
    showBanner,
    isChild,
    isLoaded,
    acceptCookies,
    rejectCookies,
    resetCookieConsent,
  } = useCookieConsent();

  return (
    <>
      {children}
      {isLoaded && (
        <CookieConsentBanner
          showBanner={showBanner}
          onAccept={acceptCookies}
          onReject={rejectCookies}
          initialPreferences={preferences}
          isChild={isChild}
        />
      )}
    </>
  );
}
