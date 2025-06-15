import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { headers } from 'next/headers';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-05-28.basil',
});

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    // Handle the event based on its type
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Check if this is a subscription or credit purchase
        if (session.mode === 'subscription') {
          await handleSubscriptionCheckout(session);
        } else if (session.mode === 'payment') {
          await handleCreditPurchase(session);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook event ${event.type}:`, error);
    return NextResponse.json(
      { error: `Error handling webhook event: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

/**
 * Handle a completed subscription checkout session
 * @param session The checkout session
 */
async function handleSubscriptionCheckout(session: Stripe.Checkout.Session) {
  const { userId, tierId, billingCycle } = session.metadata || {};

  if (!userId || !tierId || !billingCycle) {
    throw new Error('Missing required metadata in checkout session');
  }

  // Get the subscription from Stripe
  if (!session.subscription) {
    throw new Error('No subscription found in checkout session');
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Create a new subscription in the database
  await prisma.subscription.create({
    data: {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      tierId,
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      billingCycle: billingCycle as string,
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: session.customer as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Created subscription for user ${userId}`);
}

/**
 * Handle a completed credit purchase
 * @param session The checkout session
 */
async function handleCreditPurchase(session: Stripe.Checkout.Session) {
  const { userId, creditAmount } = session.metadata || {};

  if (!userId || !creditAmount) {
    throw new Error('Missing required metadata in checkout session');
  }

  // Create a new credit in the database
  await prisma.credit.create({
    data: {
      id: `credit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      amount: parseInt(creditAmount),
      remaining: parseInt(creditAmount),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      stripePaymentIntentId: session.payment_intent as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Added ${creditAmount} credits for user ${userId}`);
}

/**
 * Handle a subscription update event
 * @param subscription The Stripe subscription
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Find the subscription in the database
  const dbSubscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  });

  if (!dbSubscription) {
    console.log(`No subscription found with Stripe ID ${subscription.id}`);
    return;
  }

  // Update the subscription in the database
  await prisma.subscription.update({
    where: {
      id: dbSubscription.id,
    },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    },
  });

  console.log(`Updated subscription ${dbSubscription.id}`);
}

/**
 * Handle a subscription deletion event
 * @param subscription The Stripe subscription
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find the subscription in the database
  const dbSubscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  });

  if (!dbSubscription) {
    console.log(`No subscription found with Stripe ID ${subscription.id}`);
    return;
  }

  // Update the subscription in the database
  await prisma.subscription.update({
    where: {
      id: dbSubscription.id,
    },
    data: {
      status: 'canceled',
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    },
  });

  console.log(`Marked subscription ${dbSubscription.id} as canceled`);
}

/**
 * Handle a successful invoice payment
 * @param invoice The Stripe invoice
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) {
    console.log('Invoice is not associated with a subscription');
    return;
  }

  // Find the subscription in the database
  const dbSubscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: invoice.subscription as string,
    },
  });

  if (!dbSubscription) {
    console.log(`No subscription found with Stripe ID ${invoice.subscription}`);
    return;
  }

  // Create a transaction record
  await prisma.transaction.create({
    data: {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      subscriptionId: dbSubscription.id,
      amount: invoice.amount_paid / 100, // Convert from cents to dollars
      currency: invoice.currency.toUpperCase(),
      status: 'succeeded',
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId: invoice.payment_intent as string,
      createdAt: new Date(),
    },
  });

  console.log(`Recorded successful payment for subscription ${dbSubscription.id}`);
}

/**
 * Handle a failed invoice payment
 * @param invoice The Stripe invoice
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) {
    console.log('Invoice is not associated with a subscription');
    return;
  }

  // Find the subscription in the database
  const dbSubscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: invoice.subscription as string,
    },
  });

  if (!dbSubscription) {
    console.log(`No subscription found with Stripe ID ${invoice.subscription}`);
    return;
  }

  // Create a transaction record
  await prisma.transaction.create({
    data: {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      subscriptionId: dbSubscription.id,
      amount: invoice.amount_due / 100, // Convert from cents to dollars
      currency: invoice.currency.toUpperCase(),
      status: 'failed',
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId: invoice.payment_intent as string,
      createdAt: new Date(),
    },
  });

  // Update the subscription status if needed
  if (invoice.next_payment_attempt === null) {
    await prisma.subscription.update({
      where: {
        id: dbSubscription.id,
      },
      data: {
        status: 'past_due',
        updatedAt: new Date(),
      },
    });
  }

  console.log(`Recorded failed payment for subscription ${dbSubscription.id}`);
}

// Configure the API route to handle raw body
export const config = {
  api: {
    bodyParser: false,
  },
};
