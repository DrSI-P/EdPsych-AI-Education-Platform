'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AriaAttributes } from '@/lib/accessibility/aria-utils';

export default function AgeVerificationPage() {
  const router = useRouter();
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const age = calculateAge(dateOfBirth);
      
      if (age < 13) {
        setError('You must be at least 13 years old to use this platform.');
        setIsSubmitting(false);
        return;
      }

      const requiresConsent = age < 16;

      if (requiresConsent && !parentEmail) {
        setError('Parent or guardian email is required for users under 16.');
        setIsSubmitting(false);
        return;
      }

      // Submit age verification
      const response = await fetch('/api/auth/verify-age', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateOfBirth,
          parentEmail: requiresConsent ? parentEmail : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Age verification failed');
      }

      const data = await response.json();

      if (requiresConsent) {
        // Redirect to consent pending page
        router.push('/auth/consent-pending' as any);
      } else {
        // Age verified, proceed to dashboard
        router.push('/dashboard' as any);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Age Verification Required
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            To ensure your safety and comply with regulations, we need to verify your age.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                aria-required="true"
                aria-describedby="dob-help"
              />
              <p id="dob-help" className="mt-1 text-xs text-gray-500">
                We use this to ensure age-appropriate features and safety measures.
              </p>
            </div>

            {dateOfBirth && calculateAge(dateOfBirth) < 16 && (
              <div className="mt-4">
                <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Parent/Guardian Email
                </label>
                <input
                  id="parentEmail"
                  name="parentEmail"
                  type="email"
                  required
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="parent@example.com"
                  aria-required="true"
                  aria-describedby="parent-email-help"
                />
                <p id="parent-email-help" className="mt-1 text-xs text-gray-500">
                  Users under 16 require parental consent. We'll send a consent request to this email.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div 
              className="rounded-md bg-red-50 p-4"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !dateOfBirth}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Age'}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/privacy"
              className="text-sm text-indigo-600 hover:text-indigo-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              View our Privacy Policy
            </a>
          </div>
        </form>

        {/* Accessibility: Skip to main content link */}
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
      </div>
    </div>
  );
}