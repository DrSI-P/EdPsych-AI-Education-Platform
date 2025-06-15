import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-05-28.basil', // Use the latest API version
});

/**
 * Create a Stripe customer for a user
 * @param userId The user ID
 * @param email The user's email
 * @param name The user's name
 * @returns The Stripe customer ID
 */
export async function createStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  try {
    // Check if the user already has a Stripe customer ID
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        stripeCustomerId: {
          not: null,
        },
      },
    });

    if (subscription?.stripeCustomerId) {
      return subscription.stripeCustomerId;
    }

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create Stripe customer');
  }
}

/**
 * Create a checkout session for a subscription
 * @param userId The user ID
 * @param tierId The subscription tier ID
 * @param billingCycle The billing cycle (monthly or yearly)
 * @returns The checkout session
 */
export async function createSubscriptionCheckoutSession(
  userId: string,
  tierId: string,
  billingCycle: 'monthly' | 'yearly'
): Promise<Stripe.Checkout.Session> {
  try {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      throw new Error('User not found or missing email');
    }

    // Get the subscription tier
    const tier = await prisma.subscriptionTier.findUnique({
      where: { id: tierId },
    });

    if (!tier) {
      throw new Error('Subscription tier not found');
    }

    // Get or create a Stripe customer
    const stripeCustomerId = await createStripeCustomer(
      userId,
      user.email,
      user.name || undefined
    );

    // Get the price ID based on the billing cycle
    const priceId =
      billingCycle === 'monthly'
        ? tier.stripeMonthlyPriceId
        : tier.stripeYearlyPriceId;

    if (!priceId) {
      throw new Error(`No ${billingCycle} price ID found for tier ${tier.name}`);
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions?canceled=true`,
      metadata: {
        userId,
        tierId,
        billingCycle,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Create a checkout session for purchasing credits
 * @param userId The user ID
 * @param creditAmount The amount of credits to purchase
 * @param priceId The Stripe price ID for the credit package
 * @returns The checkout session
 */
export async function createCreditCheckoutSession(
  userId: string,
  creditAmount: number,
  priceId: string
): Promise<Stripe.Checkout.Session> {
  try {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      throw new Error('User not found or missing email');
    }

    // Get or create a Stripe customer
    const stripeCustomerId = await createStripeCustomer(
      userId,
      user.email,
      user.name || undefined
    );

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits?canceled=true`,
      metadata: {
        userId,
        creditAmount: creditAmount.toString(),
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating credit checkout session:', error);
    throw new Error('Failed to create credit checkout session');
  }
}

/**
 * Cancel a subscription
 * @param subscriptionId The subscription ID
 * @returns The updated subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    // Get the subscription from the database
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('Subscription not found or missing Stripe subscription ID');
    }

    // Cancel the subscription at the end of the current period
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update the subscription in the database
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      },
    });

    return stripeSubscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

/**
 * Resume a canceled subscription
 * @param subscriptionId The subscription ID
 * @returns The updated subscription
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    // Get the subscription from the database
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('Subscription not found or missing Stripe subscription ID');
    }

    // Resume the subscription
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      }
    );

    // Update the subscription in the database
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      },
    });

    return stripeSubscription;
  } catch (error) {
    console.error('Error resuming subscription:', error);
    throw new Error('Failed to resume subscription');
  }
}

/**
 * Change a subscription to a different tier
 * @param subscriptionId The subscription ID
 * @param newTierId The new subscription tier ID
 * @param billingCycle The billing cycle (monthly or yearly)
 * @returns The updated subscription
 */
export async function changeSubscriptionTier(
  subscriptionId: string,
  newTierId: string,
  billingCycle: 'monthly' | 'yearly'
): Promise<Stripe.Subscription> {
  try {
    // Get the subscription from the database
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('Subscription not found or missing Stripe subscription ID');
    }

    // Get the new subscription tier
    const tier = await prisma.subscriptionTier.findUnique({
      where: { id: newTierId },
    });

    if (!tier) {
      throw new Error('Subscription tier not found');
    }

    // Get the price ID based on the billing cycle
    const priceId =
      billingCycle === 'monthly'
        ? tier.stripeMonthlyPriceId
        : tier.stripeYearlyPriceId;

    if (!priceId) {
      throw new Error(`No ${billingCycle} price ID found for tier ${tier.name}`);
    }

    // Get the current subscription items
    const { data: items } = await stripe.subscriptionItems.list({
      subscription: subscription.stripeSubscriptionId,
    });

    if (items.length === 0) {
      throw new Error('No subscription items found');
    }

    // Update the subscription with the new price
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        items: [
          {
            id: items[0].id,
            price: priceId,
          },
        ],
        proration_behavior: 'create_prorations',
      }
    );

    // Update the subscription in the database
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        tierId: newTierId,
        billingCycle,
        updatedAt: new Date(),
      },
    });

    return stripeSubscription;
  } catch (error) {
    console.error('Error changing subscription tier:', error);
    throw new Error('Failed to change subscription tier');
  }
}