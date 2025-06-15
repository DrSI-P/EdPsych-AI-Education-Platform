'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ConsentSettings {
  marketingConsent: boolean;
  analyticsConsent: boolean;
  cookiesConsent: boolean;
  dataSharingConsent: boolean;
}

interface PrivacyAction {
  type: 'export' | 'delete' | 'access';
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function PrivacySettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    marketingConsent: false,
    analyticsConsent: false,
    cookiesConsent: false,
    dataSharingConsent: false,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [action, setAction] = useState<PrivacyAction>({ type: 'export', status: 'idle' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchPrivacySettings();
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin' as any);
    }
  }, [session, status]);

  const fetchPrivacySettings = async () => {
    try {
      const response = await fetch('/api/gdpr/consent-status');
      if (response.ok) {
        const data = await response.json();
        setConsentSettings({
          marketingConsent: data.marketingConsent || false,
          analyticsConsent: data.analyticsConsent || false,
          cookiesConsent: data.cookiesConsent || false,
          dataSharingConsent: data.dataSharingConsent || false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentChange = (key: keyof ConsentSettings) => {
    setConsentSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveConsentSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/gdpr/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consentSettings),
      });

      if (response.ok) {
        // Show success message
        setAction({ type: 'export', status: 'success', message: 'Privacy settings updated successfully' });
        setTimeout(() => setAction({ type: 'export', status: 'idle' }), 3000);
      }
    } catch (error) {
      setAction({ type: 'export', status: 'error', message: 'Failed to update settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const exportData = async () => {
    setAction({ type: 'export', status: 'loading' });
    try {
      const response = await fetch('/api/gdpr/data-export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-export-${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        setAction({ type: 'export', status: 'success', message: 'Data exported successfully' });
      }
    } catch (error) {
      setAction({ type: 'export', status: 'error', message: 'Failed to export data' });
    }
  };

  const deleteAccount = async () => {
    setAction({ type: 'delete', status: 'loading' });
    try {
      const response = await fetch('/api/gdpr/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'User requested deletion' }),
      });

      if (response.ok) {
        // Log out and redirect
        window.location.href = '/auth/signout';
      } else {
        const data = await response.json();
        setAction({ type: 'delete', status: 'error', message: data.error });
      }
    } catch (error) {
      setAction({ type: 'delete', status: 'error', message: 'Failed to delete account' });
    }
    setShowDeleteConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading privacy settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Privacy Settings
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your data and privacy preferences
            </p>
          </div>

          {/* Consent Settings */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Consent Preferences
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketing"
                      type="checkbox"
                      checked={consentSettings.marketingConsent}
                      onChange={() => handleConsentChange('marketingConsent')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="marketing" className="font-medium text-gray-700">
                      Marketing Communications
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive updates about new features and educational resources
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="analytics"
                      type="checkbox"
                      checked={consentSettings.analyticsConsent}
                      onChange={() => handleConsentChange('analyticsConsent')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="analytics" className="font-medium text-gray-700">
                      Analytics & Improvements
                    </label>
                    <p className="text-sm text-gray-500">
                      Help us improve the platform by sharing anonymized usage data
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="cookies"
                      type="checkbox"
                      checked={consentSettings.cookiesConsent}
                      onChange={() => handleConsentChange('cookiesConsent')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="cookies" className="font-medium text-gray-700">
                      Functional Cookies
                    </label>
                    <p className="text-sm text-gray-500">
                      Enable cookies that enhance your experience (required cookies always active)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="dataSharing"
                      type="checkbox"
                      checked={consentSettings.dataSharingConsent}
                      onChange={() => handleConsentChange('dataSharingConsent')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="dataSharing" className="font-medium text-gray-700">
                      Educational Research
                    </label>
                    <p className="text-sm text-gray-500">
                      Share anonymized data with educational researchers (with your school's approval)
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={saveConsentSettings}
                disabled={isSaving}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>

            {/* Data Rights */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Data Rights
              </h2>
              
              <div className="space-y-4">
                {/* Export Data */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Export Your Data</h3>
                    <p className="text-sm text-gray-600">
                      Download a copy of all your personal data
                    </p>
                  </div>
                  <button
                    onClick={exportData}
                    disabled={action.type === 'export' && action.status === 'loading'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {action.type === 'export' && action.status === 'loading' ? 'Exporting...' : 'Export'}
                  </button>
                </div>

                {/* Access Rights */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Access Your Information</h3>
                    <p className="text-sm text-gray-600">
                      View detailed information about data we hold
                    </p>
                  </div>
                  <a
                    href="/profile"
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    View Profile
                  </a>
                </div>

                {/* Delete Account */}
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Delete Your Account</h3>
                    <p className="text-sm text-gray-600">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {action.status === 'success' && (
              <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md" role="alert">
                {action.message}
              </div>
            )}
            
            {action.status === 'error' && (
              <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-md" role="alert">
                {action.message}
              </div>
            )}

            {/* Links */}
            <div className="border-t pt-6 text-center">
              <a
                href="/api/gdpr/privacy-policy?format=html"
                className="text-sm text-indigo-600 hover:text-indigo-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Privacy Policy
              </a>
              <span className="mx-2 text-gray-300">|</span>
              <a
                href="/contact"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Contact Data Protection Officer
              </a>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6" role="dialog" aria-modal="true">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Account Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  disabled={action.type === 'delete' && action.status === 'loading'}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                >
                  {action.type === 'delete' && action.status === 'loading' ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}