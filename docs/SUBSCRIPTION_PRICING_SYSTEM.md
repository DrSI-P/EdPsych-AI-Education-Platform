# Subscription and Pricing System Documentation

## Overview

The EdPsych-AI-Education-Platform implements a comprehensive subscription and pricing system that ensures platform sustainability while providing flexible options for users. This document outlines the technical implementation, integration points, and user flows for the subscription management, payment processing, and fair usage enforcement systems.

## System Components

### 1. Subscription Management

The subscription management system allows users to:
- View available subscription tiers with detailed feature comparisons
- Subscribe to or upgrade between tiers
- Manage billing cycles (monthly/annual)
- View usage limits and current consumption
- Access billing history and payment methods

**Key Files:**
- `/src/components/subscription/subscription-management.tsx` - Main subscription management interface
- `/src/app/api/subscription/route.ts` - API endpoints for subscription operations

### 2. Fair Usage Policy Enforcement

The fair usage system enforces tier-based limits on platform features while providing seamless pay-as-you-go options when limits are reached:
- Tracks usage of AI-intensive features
- Enforces tier-specific limits
- Provides credit-based extension when limits are reached
- Offers transparent visibility into usage and remaining allowances

**Key Files:**
- `/src/components/subscription/fair-usage.tsx` - React hook and components for fair usage integration
- `/src/app/api/subscription/fair-usage/route.ts` - API endpoints for usage tracking and credit management

### 3. Payment Processing

The payment system handles:
- Subscription payments (initial and recurring)
- Credit package purchases
- Add-on feature purchases
- Secure payment method storage
- Invoice generation and history

**Integration Points:**
- Stripe API integration for payment processing
- Secure card storage and management
- Automated billing and invoicing

## Subscription Tiers

The platform offers five subscription tiers with progressive feature access:

1. **Explorer (Free)**
   - Limited access for evaluation and basic use
   - No AI-powered features
   - 100MB storage limit

2. **Educator (£8.99/month or £89.99/year)**
   - For individual teachers and tutors
   - Basic AI features with monthly limits
   - 1GB storage

3. **Professional (£14.99/month or £149.99/year)**
   - For educational psychologists and specialist educators
   - Advanced AI features with higher limits
   - 5GB storage

4. **Institution (£11.99/month per educator, minimum 10)**
   - For schools and educational institutions
   - Comprehensive AI features with generous limits
   - 20GB shared storage

5. **Enterprise (Custom pricing)**
   - For large educational networks and districts
   - Custom implementation and limits
   - Unlimited storage

## AI Credits System

The AI credits system provides flexibility beyond subscription limits:

- Credits can be purchased in packages (100, 500, 1000, or 5000)
- Credits are consumed when using AI features beyond subscription limits
- Different features consume different credit amounts based on computational cost
- Credit balance is prominently displayed in the user interface
- Automatic prompts to purchase credits when attempting to use features beyond limits

## Fair Usage Implementation

### Usage Tracking

Each AI-intensive feature has usage tracked against monthly limits:
- AI content recommendations
- Automated progress reports
- Meeting note transcriptions
- AI-assisted lesson plans
- Blockchain credential verifications
- Copyright registrations

### Limit Enforcement

When a user attempts to use a feature:
1. The system checks if they've reached their tier's limit
2. If within limits, usage is tracked and the feature is used
3. If limit is reached, the user is prompted to:
   - Use AI credits (if available)
   - Purchase more credits
   - Upgrade their subscription

### Integration with Platform Features

The fair usage system is integrated with all AI-intensive features through the `useFairUsage` React hook, which provides:
- Functions to check limits before feature use
- Methods to track usage
- Utilities to handle credit consumption
- UI components for credit purchase prompts

## User Flows

### Subscription Sign-up Flow

1. User views subscription tiers
2. User selects desired tier
3. User enters payment information
4. System processes payment and activates subscription
5. User is redirected to dashboard with confirmation

### Feature Usage Flow

1. User attempts to use an AI feature
2. System checks usage against subscription limits
3. If within limits, feature is used and usage is tracked
4. If limit reached, system checks for available credits
5. If credits available, user is prompted to use credits
6. If no credits, user is prompted to purchase credits or upgrade

### Credit Purchase Flow

1. User views credit packages
2. User selects desired package
3. System processes payment
4. Credits are immediately added to user account
5. If initiated from feature use, the feature is automatically used with the new credits

## Technical Implementation

### Database Schema

The subscription system relies on the following data models:

```typescript
// Subscription model
interface Subscription {
  id: string;
  userId: string;
  tier: 'free' | 'educator' | 'professional' | 'institution' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'canceled' | 'past_due';
  startDate: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId: string;
}

// Usage tracking model
interface Usage {
  id: string;
  userId: string;
  feature: string;
  count: number;
  resetDate: Date;
}

// Credits model
interface Credits {
  id: string;
  userId: string;
  balance: number;
  transactions: CreditTransaction[];
}

// Add-ons model
interface AddOn {
  id: string;
  subscriptionId: string;
  type: string;
  quantity: number;
  billingCycle: 'monthly' | 'annual';
  currentPeriodEnd: Date;
}
```

### API Endpoints

The subscription system exposes the following API endpoints:

- `POST /api/subscription` - Create or update subscription
- `GET /api/subscription` - Get current subscription details
- `POST /api/subscription/cancel` - Cancel subscription
- `POST /api/subscription/fair-usage` - Track and check feature usage
- `POST /api/subscription/credits` - Manage AI credits
- `POST /api/subscription/addons` - Manage subscription add-ons
- `GET /api/subscription/invoices` - Get billing history

## Testing and Validation

The subscription system has been tested for:

- Successful subscription creation and management
- Accurate limit enforcement
- Seamless credit purchase and usage
- Edge cases (e.g., subscription expiration, failed payments)
- User experience and flow continuity

## Future Enhancements

Planned enhancements to the subscription system include:

1. Team management for Institution and Enterprise tiers
2. Usage analytics dashboard for administrators
3. Customizable usage limits for Enterprise customers
4. Promotional codes and discounts
5. Referral program integration

## Conclusion

The subscription and pricing system provides a robust foundation for platform sustainability while offering flexible options for users at different scales. The tiered approach with pay-as-you-go extensions ensures that users can access advanced features based on their specific needs and budget constraints.
