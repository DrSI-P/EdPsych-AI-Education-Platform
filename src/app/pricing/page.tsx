'use client';

import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import Link from 'next/link'; // Unused import
import { UILink } from '@/components/ui';

// Feature explanation tooltip
const FeatureTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground inline-block cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Feature item with check mark
const FeatureItem = ({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) => (
  <div className="flex items-start mb-2">
    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
    <span className="text-sm">
      {children}
      {tooltip && <FeatureTooltip content={tooltip} />}
    </span>
  </div>
);

// Feature item that's not included
const NotIncludedFeature = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start mb-2 text-muted-foreground">
    <span className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
    <span className="text-sm">{children}</span>
  </div>
);

// Credit badge component
const CreditBadge = ({ amount }: { amount: number }) => (
  <Badge variant="outline" className="ml-2 bg-primary/10">
    {amount} credits/month
  </Badge>
);

export default function PricingPage() : React.ReactNode {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Calculate yearly prices (20% discount)
  const getYearlyPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 12 * 0.8).toFixed(2);
  };

  return (
    <div className="container max-w-6xl py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for you. All plans include access to our core educational platform.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Tabs defaultValue="individual" className="w-full max-w-3xl">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="individual">Individual & Family</TabsTrigger>
              <TabsTrigger value="education">Educational Institutions</TabsTrigger>
            </TabsList>
          </div>

          {/* Individual & Family Plans */}
          <TabsContent value="individual">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                <Button
                  variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </Button>
                <Button
                  variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly <span className="ml-1 text-xs font-normal">Save 20%</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Basic access to get started</CardDescription>
                  <div className="mt-4 text-3xl font-bold">£0</div>
                </CardHeader>
                <CardContent className="h-[380px] overflow-y-auto">
                  <FeatureItem tooltip="Access core curriculum materials with limited depth">
                    Limited curriculum access
                  </FeatureItem>
                  <FeatureItem tooltip="Track your progress through available content">
                    Basic progress tracking
                  </FeatureItem>
                  <FeatureItem tooltip="Pre-recorded navigation videos to help you get started">
                    Pre-generated AI avatar videos
                  </FeatureItem>
                  <FeatureItem tooltip="Text alternatives available for all video content">
                    Text-based alternatives
                  </FeatureItem>
                  <FeatureItem tooltip="Basic assessment tools to test your knowledge">
                    Basic assessments
                  </FeatureItem>
                  <NotIncludedFeature>Custom AI video generation</NotIncludedFeature>
                  <NotIncludedFeature>Advanced reporting</NotIncludedFeature>
                  <NotIncludedFeature>Offline access</NotIncludedFeature>
                  <NotIncludedFeature>Ad-free experience</NotIncludedFeature>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <UILink href="/register">Get Started</UILink>
                  </Button>
                </CardFooter>
              </Card>

              {/* Standard Tier */}
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Standard</CardTitle>
                    <Badge>Popular</Badge>
                  </div>
                  <CardDescription>Complete access for individual learners</CardDescription>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">
                      {billingCycle === 'monthly' ? '£9.99' : `£${getYearlyPrice(9.99)}`}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually (£{getYearlyPrice(9.99)})
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="h-[380px] overflow-y-auto">
                  <FeatureItem tooltip="Access all curriculum content across subjects">
                    Full curriculum access
                  </FeatureItem>
                  <FeatureItem tooltip="Detailed tracking of your learning journey">
                    Comprehensive progress tracking
                  </FeatureItem>
                  <FeatureItem tooltip="Complete library of navigation and help videos">
                    Complete video library
                  </FeatureItem>
                  <FeatureItem tooltip="Create custom AI videos for your learning needs">
                    AI video generation <CreditBadge amount={20} />
                  </FeatureItem>
                  <FeatureItem tooltip="No advertisements throughout the platform">
                    Ad-free experience
                  </FeatureItem>
                  <FeatureItem tooltip="Basic customization of your learning experience">
                    Basic customization options
                  </FeatureItem>
                  <FeatureItem tooltip="Download resources for offline use">
                    Downloadable resources
                  </FeatureItem>
                  <NotIncludedFeature>Advanced assessment tools</NotIncludedFeature>
                  <NotIncludedFeature>Specialized subject experts</NotIncludedFeature>
                  <NotIncludedFeature>Offline access to all content</NotIncludedFeature>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <UILink href="/register?plan=standard">Subscribe Now</UILink>
                  </Button>
                </CardFooter>
              </Card>

              {/* Premium Tier */}
              <Card>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>Enhanced features for serious learners</CardDescription>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">
                      {billingCycle === 'monthly' ? '£19.99' : `£${getYearlyPrice(19.99)}`}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually (£{getYearlyPrice(19.99)})
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="h-[380px] overflow-y-auto">
                  <FeatureItem>Everything in Standard</FeatureItem>
                  <FeatureItem tooltip="Create more custom AI videos for your learning needs">
                    Enhanced AI video generation <CreditBadge amount={50} />
                  </FeatureItem>
                  <FeatureItem tooltip="Advanced tools to assess your knowledge and skills">
                    Advanced assessment tools
                  </FeatureItem>
                  <FeatureItem tooltip="Access to specialized subject expert avatars">
                    Specialized subject experts
                  </FeatureItem>
                  <FeatureItem tooltip="Comprehensive exam preparation resources">
                    Exam preparation resources
                  </FeatureItem>
                  <FeatureItem tooltip="Access content even when offline">
                    Offline access to all content
                  </FeatureItem>
                  <FeatureItem tooltip="Priority support when you need help">
                    Priority support
                  </FeatureItem>
                  <FeatureItem tooltip="Full customization of your learning experience">
                    Full customization options
                  </FeatureItem>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <UILink href="/register?plan=premium">Subscribe Now</UILink>
                  </Button>
                </CardFooter>
              </Card>

              {/* Family Plan - Shown below on mobile, side by side on desktop */}
              <Card className="md:col-span-3 mt-4">
                <CardHeader className="md:flex md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Family Plan</CardTitle>
                    <CardDescription>Perfect for households with multiple learners</CardDescription>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right">
                    <div className="text-3xl font-bold">
                      {billingCycle === 'monthly' ? '£29.99' : `£${getYearlyPrice(29.99)}`}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-muted-foreground">
                        Billed annually (£{getYearlyPrice(29.99)})
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <FeatureItem>All Premium features</FeatureItem>
                      <FeatureItem tooltip="Create profiles for up to 5 family members">
                        Up to 5 user profiles
                      </FeatureItem>
                      <FeatureItem tooltip="Shared pool of credits for all family members">
                        Shared AI video credits <CreditBadge amount={100} />
                      </FeatureItem>
                    </div>
                    <div>
                      <FeatureItem tooltip="Monitor progress across all family members">
                        Family progress dashboard
                      </FeatureItem>
                      <FeatureItem tooltip="Share resources between family members">
                        Shared resources library
                      </FeatureItem>
                      <FeatureItem tooltip="Parental controls and oversight features">
                        Parental controls
                      </FeatureItem>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full md:w-auto md:ml-auto" asChild>
                    <UILink href="/register?plan=family">Subscribe Now</UILink>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Educational Institution Plans */}
          <TabsContent value="education">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Classroom Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Classroom</CardTitle>
                  <CardDescription>For individual teachers and classrooms</CardDescription>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">£299</div>
                    <div className="text-sm text-muted-foreground">per year, up to 30 students</div>
                  </div>
                </CardHeader>
                <CardContent className="h-[380px] overflow-y-auto">
                  <FeatureItem>All Premium features</FeatureItem>
                  <FeatureItem tooltip="Tools to manage your classroom effectively">
                    Classroom management tools
                  </FeatureItem>
                  <FeatureItem tooltip="Detailed analytics on student progress">
                    Student progress analytics
                  </FeatureItem>
                  <FeatureItem tooltip="Credits for AI video generation">
                    AI video generation <CreditBadge amount={300} />
                  </FeatureItem>
                  <FeatureItem tooltip="Tools for collaborative learning activities">
                    Collaborative learning tools
                  </FeatureItem>
                  <FeatureItem tooltip="Align content with curriculum standards">
                    Curriculum alignment tools
                  </FeatureItem>
                  <NotIncludedFeature>School-wide analytics</NotIncludedFeature>
                  <NotIncludedFeature>Administrator dashboard</NotIncludedFeature>
                  <NotIncludedFeature>Custom branding</NotIncludedFeature>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <UILink href="/contact?plan=classroom">Contact Sales</UILink>
                  </Button>
                </CardFooter>
              </Card>

              {/* School Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>School</CardTitle>
                  <CardDescription>For entire schools</CardDescription>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">From £3,000</div>
                    <div className="text-sm text-muted-foreground">per year, based on student count</div>
                  </div>
                </CardHeader>
                <CardContent className="h-[380px] overflow-y-auto">
                  <FeatureItem>All Classroom features</FeatureItem>
                  <FeatureItem tooltip="Analytics across the entire school">
                    School-wide analytics
                  </FeatureItem>
                  <FeatureItem tooltip="Dashboard for school administrators">
                    Administrator dashboard
                  </FeatureItem>
                  <FeatureItem tooltip="Integration with school systems">
                    School system integration
                  </FeatureItem>
                  <FeatureItem tooltip="Custom branding options for your school">
                    Custom branding options
                  </FeatureItem>
                  <FeatureItem tooltip="Dedicated support for your school">
                    Dedicated support
                  </FeatureItem>
                  <NotIncludedFeature>District-wide analytics</NotIncludedFeature>
                  <NotIncludedFeature>API access</NotIncludedFeature>
                  <NotIncludedFeature>Implementation support</NotIncludedFeature>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <UILink href="/contact?plan=school">Contact Sales</UILink>
                  </Button>
                </CardFooter>
              </Card>

              {/* District Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>District</CardTitle>
                  <CardDescription>For school districts and large organizations</CardDescription>
                  <div className="mt-4">
                    <div className="text-xl font-bold">Custom Pricing</div>
                    <div className="text-sm text-muted-foreground">Contact us for a quote</div>
                  </div>
                </CardHeader>
                <CardContent className="h-[380px] overflow-y-auto">
                  <FeatureItem>All School features</FeatureItem>
                  <FeatureItem tooltip="Analytics across the entire district">
                    District-wide analytics
                  </FeatureItem>
                  <FeatureItem tooltip="API access for custom integrations">
                    API access for custom integrations
                  </FeatureItem>
                  <FeatureItem tooltip="Support for implementation across the district">
                    Implementation support
                  </FeatureItem>
                  <FeatureItem tooltip="Training for staff across the district">
                    Training for staff
                  </FeatureItem>
                  <FeatureItem tooltip="Dedicated account manager for your district">
                    Dedicated account manager
                  </FeatureItem>
                  <FeatureItem tooltip="Custom development for district needs">
                    Custom development options
                  </FeatureItem>
                  <FeatureItem tooltip="Volume discounts for district-wide deployment">
                    Volume discounts
                  </FeatureItem>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <UILink href="/contact?plan=district">Contact Sales</UILink>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Additional Credits Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Need Additional AI Video Credits?</h2>
          <p className="text-muted-foreground">
            Purchase additional credits for AI video generation as needed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Small Credit Package */}
          <Card>
            <CardHeader>
              <CardTitle>Small Package</CardTitle>
              <div className="mt-2 text-2xl font-bold">£4.99</div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-3xl font-bold text-primary mb-2">20</p>
              <p className="text-center text-sm text-muted-foreground">credits</p>
              <p className="text-center text-sm mt-2">(£0.25 per credit)</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <UILink href="/credits?package=small">Purchase</UILink>
              </Button>
            </CardFooter>
          </Card>

          {/* Medium Credit Package */}
          <Card className="border-primary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Medium Package</CardTitle>
                <Badge>Best Value</Badge>
              </div>
              <div className="mt-2 text-2xl font-bold">£9.99</div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-3xl font-bold text-primary mb-2">50</p>
              <p className="text-center text-sm text-muted-foreground">credits</p>
              <p className="text-center text-sm mt-2">(£0.20 per credit)</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <UILink href="/credits?package=medium">Purchase</UILink>
              </Button>
            </CardFooter>
          </Card>

          {/* Large Credit Package */}
          <Card>
            <CardHeader>
              <CardTitle>Large Package</CardTitle>
              <div className="mt-2 text-2xl font-bold">£24.99</div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-3xl font-bold text-primary mb-2">150</p>
              <p className="text-center text-sm text-muted-foreground">credits</p>
              <p className="text-center text-sm mt-2">(£0.17 per credit)</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <UILink href="/credits?package=large">Purchase</UILink>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">What are AI video credits?</h3>
            <p className="text-muted-foreground text-sm">
              AI video credits are used to generate custom AI avatar videos. Each credit allows you to create approximately 30 seconds of video content. Credits are refreshed monthly with your subscription, and unused credits do not roll over.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Can I switch between plans?</h3>
            <p className="text-muted-foreground text-sm">
              Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference for the remainder of your billing cycle. When downgrading, the change will take effect at the end of your current billing cycle.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Do you offer refunds?</h3>
            <p className="text-muted-foreground text-sm">
              We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied with your purchase, contact our support team within 14 days for a full refund.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground text-sm">
              We accept all major credit cards, including Visa, Mastercard, and American Express. For educational institutions, we also accept purchase orders.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Do you offer discounts for disadvantaged students?</h3>
            <p className="text-muted-foreground text-sm">
              Yes, we offer a scholarship program for eligible students. Please contact our support team with relevant documentation to apply for our educational access program.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Join thousands of students, educators, and families who are transforming their learning experience with EdPsych AI Education Platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild>
            <UILink href="/register">Start Free Trial</UILink>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <UILink href="/contact">Contact Sales</UILink>
          </Button>
        </div>
      </div>
    </div>
  );
}
