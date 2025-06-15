'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Settings, X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowDetails(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-purple-900" />
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                Cookie Notice
                <Shield className="w-5 h-5 text-yellow-400" />
              </h3>
              <p className="text-sm mb-4 text-gray-200">
                We use cookies to enhance your experience, analyze site usage, and assist in our educational support efforts. 
                Your privacy is paramount to us - we follow strict DfE guidelines and GDPR regulations.
              </p>
              
              {!showDetails && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2 bg-yellow-400 text-purple-900 font-semibold rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Manage Preferences
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowBanner(false)}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              aria-label="Dismiss cookie banner"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cookie Details */}
          {showDetails && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Cookie Preferences</h4>
              
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="necessary"
                    checked={preferences.necessary}
                    disabled
                    className="mt-1 w-5 h-5 rounded"
                  />
                  <div className="flex-grow">
                    <label htmlFor="necessary" className="font-medium cursor-not-allowed">
                      Necessary Cookies (Always Active)
                    </label>
                    <p className="text-sm text-gray-300 mt-1">
                      Essential for the website to function properly. These include security, authentication, and accessibility features.
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                    className="mt-1 w-5 h-5 rounded text-yellow-400 focus:ring-yellow-400"
                  />
                  <div className="flex-grow">
                    <label htmlFor="analytics" className="font-medium cursor-pointer">
                      Analytics Cookies
                    </label>
                    <p className="text-sm text-gray-300 mt-1">
                      Help us understand how visitors interact with our platform to improve educational outcomes.
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                    className="mt-1 w-5 h-5 rounded text-yellow-400 focus:ring-yellow-400"
                  />
                  <div className="flex-grow">
                    <label htmlFor="marketing" className="font-medium cursor-pointer">
                      Marketing Cookies
                    </label>
                    <p className="text-sm text-gray-300 mt-1">
                      Used to track visitors across websites to display relevant educational resources and support services.
                    </p>
                  </div>
                </div>

                {/* Preference Cookies */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="preferences"
                    checked={preferences.preferences}
                    onChange={(e) => setPreferences({...preferences, preferences: e.target.checked})}
                    className="mt-1 w-5 h-5 rounded text-yellow-400 focus:ring-yellow-400"
                  />
                  <div className="flex-grow">
                    <label htmlFor="preferences" className="font-medium cursor-pointer">
                      Preference Cookies
                    </label>
                    <p className="text-sm text-gray-300 mt-1">
                      Remember your settings and preferences for a personalized learning experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2 bg-yellow-400 text-purple-900 font-semibold rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop blur when banner is open */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
    </>
  );
}