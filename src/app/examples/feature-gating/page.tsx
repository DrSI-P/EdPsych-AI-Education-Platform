'use client';

import dynamic from 'next/dynamic';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FeatureGate, CreditFeatureGate } from '@/components/FeatureGate';
// Original component
function FeatureGatingExamplePage() {
  const { data: session, status } = useSession();
  const [creditResult, setCreditResult] = useState<string | null>(null);

  // Handle credit usage result
  const handleCreditUse = (result: { success: boolean; remainingCredits?: number }) => {
    if (result.success) {
      setCreditResult(`Successfully used credits! You have ${result.remainingCredits} credits remaining.`);
    } else {
      setCreditResult('Failed to use credits.');
    }
  };

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access this page.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Feature Gating Examples</h1>
      
      {creditResult && (
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <p className="text-green-700">{creditResult}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Feature Gate Example */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Basic Feature Gate</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Example of a basic feature gate for a subscription-based feature.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <FeatureGate feature="basic_analytics">
              <div className="bg-indigo-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-indigo-800">Analytics Dashboard</h3>
                <p className="mt-2 text-sm text-indigo-700">
                  This content is only visible to users with access to the basic_analytics feature.
                </p>
              </div>
            </FeatureGate>
          </div>
        </div>
        
        {/* Credit Feature Gate Example */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Credit Feature Gate</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Example of a feature gate for a credit-based feature.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <CreditFeatureGate 
              feature="ai_lesson_plan" 
              onCreditUse={handleCreditUse}
            >
              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-purple-800">AI Lesson Plan Generator</h3>
                <p className="mt-2 text-sm text-purple-700">
                  This content is only visible after spending credits for the ai_lesson_plan feature.
                </p>
              </div>
            </CreditFeatureGate>
          </div>
        </div>
        
        {/* Feature Gate with Custom Fallback */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Custom Fallback</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Example of a feature gate with a custom fallback component.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <FeatureGate 
              feature="advanced_reporting"
              fallback={
                <div className="bg-yellow-50 p-4 rounded-md">
                  <h3 className="text-md font-medium text-yellow-800">Advanced Reporting</h3>
                  <p className="mt-2 text-sm text-yellow-700">
                    This feature requires the Professional plan. Upgrade now to access advanced reporting tools!
                  </p>
                  <a
                    href="/subscriptions"
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Upgrade to Professional
                  </a>
                </div>
              }
            >
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-green-800">Advanced Reporting Dashboard</h3>
                <p className="mt-2 text-sm text-green-700">
                  This content is only visible to users with access to the advanced_reporting feature.
                </p>
              </div>
            </FeatureGate>
          </div>
        </div>
        
        {/* Feature Gate with Loading Component */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Custom Loading</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Example of a feature gate with a custom loading component.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <FeatureGate 
              feature="content_library"
              loadingComponent={
                <div className="p-4 border border-blue-200 rounded-md bg-blue-50">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                    <p className="text-blue-700">Loading content library access...</p>
                  </div>
                </div>
              }
            >
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-blue-800">Content Library</h3>
                <p className="mt-2 text-sm text-blue-700">
                  This content is only visible to users with access to the content_library feature.
                </p>
              </div>
            </FeatureGate>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Feature Access Documentation</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Available Features</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Cost
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available In
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">basic_analytics</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Access to basic analytics dashboard</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">None</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Professional, Enterprise</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ai_lesson_plan</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Generate AI-powered lesson plans</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 credits per use</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All plans (credit-based)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">advanced_reporting</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Access to advanced reporting tools</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">None</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Enterprise</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">content_library</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Access to premium content library</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">None</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Professional, Enterprise</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FeatureGatingExamplePage;