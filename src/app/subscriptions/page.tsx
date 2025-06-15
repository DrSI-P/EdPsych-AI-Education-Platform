'use client';

import dynamic from 'next/dynamic';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
interface Feature {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  creditCost: number | null;
  isActive: boolean;
}

interface SubscriptionTier {
  id: string;
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isActive: boolean;
  maxUsers: number;
  tierType: string;
  featuresData: Feature[];
}

interface UserSubscription {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  billingCycle: string;
  tier: SubscriptionTier;
  credits: {
    total: number;
    details: Array<{
      id: string;
      amount: number;
      remaining: number;
      expiresAt: string | null;
    }>;
  };
}

// Load Stripe on the client side
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');


// Original component
function SubscriptionsPage() {
  const { data: session, status } = useSession();
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedCreditPackage, setSelectedCreditPackage] = useState<'small' | 'medium' | 'large' | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all subscription tiers
        const tiersResponse = await fetch('/api/subscriptions', { cache: "no-store" });
        if (!tiersResponse.ok) {
          throw new Error('Failed to fetch subscription tiers');
        }
        const tiersData = await tiersResponse.json();
        setTiers(tiersData);

        // If user is authenticated, fetch their subscription
        if (status === 'authenticated') {
          const userSubResponse = await fetch('/api/subscriptions/user', { cache: "no-store" });
          if (userSubResponse.ok) {
            const userSubData = await userSubResponse.json();
            if (userSubData.subscription) {
              setUserSubscription(userSubData);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching subscription data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Check for success or canceled query parameters
    const url = new URL(window.location.href);
    const success = url.searchParams.get('success');
    const canceled = url.searchParams.get('canceled');
    
    if (success === 'true') {
      setSuccessMessage('Payment successful! Your subscription has been updated.');
      // Refresh subscription data
      if (status === 'authenticated') {
        fetchUserSubscription();
      }
    } else if (canceled === 'true') {
      setError('Payment canceled. Please try again if you want to subscribe.');
    }

    // Clear URL parameters
    if (success || canceled) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [status]);

  // Function to fetch user subscription
  async function fetchUserSubscription() {
    try {
      const userSubResponse = await fetch('/api/subscriptions/user', { cache: "no-store" });
      if (userSubResponse.ok) {
        const userSubData = await userSubResponse.json();
        if (userSubData.subscription) {
          setUserSubscription(userSubData);
        }
      }
    } catch (err) {
      console.error('Error fetching user subscription:', err);
    }
  }

  // Function to handle subscription checkout
  async function handleSubscribe(tierId: string) {
    if (!session) {
      setError('You must be signed in to subscribe');
      return;
    }

    setCheckoutLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierId,
          billingCycle,
        }, { cache: "no-store" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating checkout session:', err);
    } finally {
      setCheckoutLoading(false);
    }
  }

  // Function to handle subscription management
  async function manageSubscription(action: 'cancel' | 'resume' | 'change', subscriptionId: string, newTierId?: string) {
    if (!session) {
      setError('You must be signed in to manage your subscription');
      return;
    }

    setManagingSubscription(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          subscriptionId,
          newTierId,
          billingCycle,
        }, { cache: "no-store" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to manage subscription');
      }

      const result = await response.json();
      
      // Update the subscription in the UI
      await fetchUserSubscription();
      
      setSuccessMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error managing subscription:', err);
    } finally {
      setManagingSubscription(false);
    }
  }

  // Function to handle credit purchase
  async function handleCreditPurchase(packageSize: 'small' | 'medium' | 'large') {
    if (!session) {
      setError('You must be signed in to purchase credits');
      return;
    }

    setSelectedCreditPackage(packageSize);
    setError(null);

    try {
      const response = await fetch('/api/checkout/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageSize,
        }, { cache: "no-store" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating credit checkout session:', err);
    } finally {
      setSelectedCreditPackage(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Subscription Plans</h1>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {userSubscription && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Your Current Subscription</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about your active subscription.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Plan</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userSubscription.tier.displayName}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {userSubscription.status}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Billing Cycle</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userSubscription.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Current Period</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(userSubscription.currentPeriodStart).toLocaleDateString()} to{' '}
                  {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Available Credits</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userSubscription.credits.total}
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <button
                onClick={() => handleCreditPurchase('medium')}
                disabled={selectedCreditPackage !== null}
                className="mb-3 sm:mb-0 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {selectedCreditPackage ? 'Processing...' : 'Purchase Credits'}
              </button>
              {!userSubscription.cancelAtPeriodEnd ? (
                <button
                  onClick={() => manageSubscription('cancel', userSubscription.id)}
                  disabled={managingSubscription}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {managingSubscription ? 'Processing...' : 'Cancel Subscription'}
                </button>
              ) : (
                <button
                  onClick={() => manageSubscription('resume', userSubscription.id)}
                  disabled={managingSubscription}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {managingSubscription ? 'Processing...' : 'Resume Subscription'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-center">
          <div className="relative bg-white rounded-lg p-1 flex">
            <button
              type="button"
              className={`${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500'
              } relative w-1/2 rounded-md py-2 px-4 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly billing
            </button>
            <button
              type="button"
              className={`${
                billingCycle === 'yearly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500'
              } ml-0.5 relative w-1/2 rounded-md py-2 px-4 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly billing
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Save 15%
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`bg-white shadow overflow-hidden rounded-lg border ${
              userSubscription?.tier.id === tier.id
                ? 'border-indigo-500 ring-2 ring-indigo-500'
                : 'border-gray-200'
            }`}
          >
            {userSubscription?.tier.id === tier.id && (
              <div className="bg-indigo-500 text-white text-center py-1 text-sm font-medium">
                Current Plan
              </div>
            )}
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-gray-900">{tier.displayName}</h3>
              <p className="mt-2 text-gray-500">{tier.description}</p>
              <p className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                </span>
                <span className="text-base font-medium text-gray-500">
                  /{billingCycle === 'monthly' ? 'mo' : 'year'}
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                For up to {tier.maxUsers} {tier.maxUsers === 1 ? 'user' : 'users'}
              </p>
            </div>
            <div className="px-6 pb-8">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Features included:</h4>
              <ul className="space-y-3">
                {tier.featuresData.map((feature) => (
                  <li key={feature.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {feature.displayName}
                      {feature.creditCost && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({feature.creditCost} credits per use)
                        </span>
                      )}
                    </p>
                  </li>
                ))}
                {tier.featuresData.length === 0 && (
                  <li className="text-sm text-gray-500">No features included</li>
                )}
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {userSubscription?.tier.id === tier.id ? (
                <button
                  disabled
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-300 focus:outline-none"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => userSubscription
                    ? manageSubscription('change', userSubscription.id, tier.id)
                    : handleSubscribe(tier.id)
                  }
                  disabled={checkoutLoading || managingSubscription}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {checkoutLoading || managingSubscription
                    ? 'Processing...'
                    : userSubscription
                      ? 'Switch Plan'
                      : 'Subscribe'
                  }
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Credits</h2>
        <p className="text-gray-600 mb-4">
          Some premium features require credits to use. Credits can be purchased separately or are included with certain subscription tiers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-gray-900 mb-2">AI Lesson Planning</h3>
            <p className="text-gray-600 text-sm mb-2">Generate lesson plans using AI</p>
            <p className="text-indigo-600 font-medium">5 credits per use</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-gray-900 mb-2">Content Differentiation</h3>
            <p className="text-gray-600 text-sm mb-2">Automatically differentiate content</p>
            <p className="text-indigo-600 font-medium">3 credits per use</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="font-medium text-gray-900 mb-2">Immersive Experiences</h3>
            <p className="text-gray-600 text-sm mb-2">Access immersive learning experiences</p>
            <p className="text-indigo-600 font-medium">10 credits per use</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCreditPurchase('small')}
              disabled={selectedCreditPackage !== null}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {selectedCreditPackage === 'small' ? 'Processing...' : 'Buy 50 Credits'}
            </button>
            <button
              onClick={() => handleCreditPurchase('medium')}
              disabled={selectedCreditPackage !== null}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {selectedCreditPackage === 'medium' ? 'Processing...' : 'Buy 100 Credits'}
            </button>
            <button
              onClick={() => handleCreditPurchase('large')}
              disabled={selectedCreditPackage !== null}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {selectedCreditPackage === 'large' ? 'Processing...' : 'Buy 200 Credits'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionsPage;