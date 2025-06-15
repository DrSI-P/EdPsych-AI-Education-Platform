'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface StudentInfo {
  name: string;
  email: string;
  age: number;
}

function ParentalConsentContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';
  
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [parentName, setParentName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [consent, setConsent] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      fetchConsentDetails();
    }
  }, [token]);

  const fetchConsentDetails = async () => {
    try {
      const response = await fetch(`/api/auth/parental-consent?token=${token}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load consent details');
      }
      
      const data = await response.json();
      setStudentInfo(data.student);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (consent === null) {
      setError('Please indicate whether you grant or deny consent');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/parental-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          consent,
          parentName,
          relationship,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit consent');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consent details...</p>
        </div>
      </div>
    );
  }

  if (!token || !studentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Consent Link</h1>
          <p className="text-gray-600">
            This consent link is invalid or has expired. Please contact the school if you need assistance.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Consent {consent ? 'Granted' : 'Denied'}
            </h2>
            <p className="mt-2 text-gray-600">
              Your response has been recorded. {consent 
                ? `${studentInfo.name} can now access the EdPsych AI Platform.`
                : `${studentInfo.name}'s account will remain inactive.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Parental Consent Required
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Student Information
            </h2>
            <p className="text-blue-800">
              <strong>Name:</strong> {studentInfo.name}<br />
              <strong>Email:</strong> {studentInfo.email}<br />
              <strong>Age:</strong> {studentInfo.age} years old
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              About EdPsych AI Platform
            </h2>
            <p className="text-gray-700 mb-3">
              EdPsych AI Platform is an educational technology platform designed to support learning and development. 
              Because your child is under 16, we require your consent before they can use our services.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>What we collect:</strong> Name, email, learning progress, and educational activities.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>How we protect data:</strong> We use encryption, secure servers, and follow strict DfE guidelines 
              for educational data protection.
            </p>
            <p className="text-gray-700">
              <strong>Your rights:</strong> You can request to see, correct, or delete your child's data at any time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                Your Full Name
              </label>
              <input
                type="text"
                id="parentName"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                Relationship to Student
              </label>
              <select
                id="relationship"
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                aria-required="true"
              >
                <option value="">Select relationship</option>
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="carer">Carer</option>
              </select>
            </div>

            <fieldset className="mt-6">
              <legend className="text-base font-medium text-gray-900">
                Do you give consent for {studentInfo.name} to use EdPsych AI Platform?
              </legend>
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <input
                    id="consent-yes"
                    name="consent"
                    type="radio"
                    value="yes"
                    onChange={() => setConsent(true)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    aria-describedby="consent-yes-description"
                  />
                  <label htmlFor="consent-yes" className="ml-3 block text-sm font-medium text-gray-700">
                    Yes, I give consent
                  </label>
                </div>
                <p id="consent-yes-description" className="ml-7 text-sm text-gray-500">
                  I understand and agree to the data collection and usage described above.
                </p>
                
                <div className="flex items-center">
                  <input
                    id="consent-no"
                    name="consent"
                    type="radio"
                    value="no"
                    onChange={() => setConsent(false)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    aria-describedby="consent-no-description"
                  />
                  <label htmlFor="consent-no" className="ml-3 block text-sm font-medium text-gray-700">
                    No, I do not give consent
                  </label>
                </div>
                <p id="consent-no-description" className="ml-7 text-sm text-gray-500">
                  The student's account will remain inactive and they will not be able to use the platform.
                </p>
              </div>
            </fieldset>

            {error && (
              <div className="rounded-md bg-red-50 p-4" role="alert" aria-live="assertive">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={isSubmitting || !parentName || !relationship || consent === null}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <a
                href="/api/gdpr/privacy-policy?format=html"
                className="text-sm text-indigo-600 hover:text-indigo-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read our full Privacy Policy
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ParentalConsentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ParentalConsentContent />
    </Suspense>
  );
}