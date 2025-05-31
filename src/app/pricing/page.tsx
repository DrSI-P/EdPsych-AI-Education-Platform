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
import Link from 'next/link';

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

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Calculate yearly prices (20% discount)
  const getYearlyPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 12 * 0.8).toFixed(2);
  };

  return (
    <div className="container max-w-6xl py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for you. All plans include access to our core educational platform aligned with UK curriculum standards.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Tabs defaultValue="individual" className="w-full max-w-3xl">
          <div className="flex justify-center mb-6">
            <TabsList className="tabs-list">
              <TabsTrigger value="individual" className="tab">Individual & Family</TabsTrigger>
              <TabsTrigger value="education" className="tab">Educational Institutions</TabsTrigger>
            </TabsList>
          </div>

          {/* Individual & Family Plans */}
          <TabsContent value="individual">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                <Button
                  variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  className={billingCycle === 'monthly' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-ghost'}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </Button>
                <Button
                  variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
                  size="sm"
                  className={billingCycle === 'yearly' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-ghost'}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly <span className="ml-1 text-xs font-normal">Save 20%</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Free</CardTitle>
                  <CardDescription className="card-description">Basic access to get started</CardDescription>
                  <div className="mt-4 text-3xl font-bold">£0</div>
                </CardHeader>
                <CardContent className="card-body h-[380px] overflow-y-auto">
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
                <CardFooter className="card-footer">
                  <Button variant="outline" className="w-full btn btn-outline" asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Standard Tier */}
              <Card className="card card-bordered border-primary hover:shadow-md transition-shadow">
                <CardHeader className="card-header">
                  <div className="flex justify-between items-center">
                    <CardTitle className="card-title">Standard</CardTitle>
                    <Badge className="badge badge-primary">Popular</Badge>
                  </div>
                  <CardDescription className="card-description">Complete access for individual learners</CardDescription>
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
                <CardContent className="card-body h-[380px] overflow-y-auto">
                  <FeatureItem tooltip="Access all curriculum content across subjects aligned with UK standards">
                    Full UK curriculum access
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
                  <FeatureItem tooltip="Basic customisation of your learning experience">
                    Basic customisation options
                  </FeatureItem>
                  <FeatureItem tooltip="Download resources for offline use">
                    Downloadable resources
                  </FeatureItem>
                  <NotIncludedFeature>Advanced assessment tools</NotIncludedFeature>
                  <NotIncludedFeature>Specialised subject experts</NotIncludedFeature>
                  <NotIncludedFeature>Offline access to all content</NotIncludedFeature>
                </CardContent>
                <CardFooter className="card-footer">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/register?plan=standard">Subscribe Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Premium Tier */}
              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Premium</CardTitle>
                  <CardDescription className="card-description">Enhanced features for serious learners</CardDescription>
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
                <CardContent className="card-body h-[380px] overflow-y-auto">
                  <FeatureItem>Everything in Standard</FeatureItem>
                  <FeatureItem tooltip="Create more custom AI videos for your learning needs">
                    Enhanced AI video generation <CreditBadge amount={50} />
                  </FeatureItem>
                  <FeatureItem tooltip="Advanced tools to assess your knowledge and skills aligned with UK examination standards">
                    Advanced assessment tools
                  </FeatureItem>
                  <FeatureItem tooltip="Access to specialised subject expert avatars">
                    Specialised subject experts
                  </FeatureItem>
                  <FeatureItem tooltip="Comprehensive exam preparation resources for UK qualifications">
                    UK exam preparation resources
                  </FeatureItem>
                  <FeatureItem tooltip="Access content even when offline">
                    Offline access to all content
                  </FeatureItem>
                  <FeatureItem tooltip="Priority support when you need help">
                    Priority support
                  </FeatureItem>
                  <FeatureItem tooltip="Full customisation of your learning experience">
                    Full customisation options
                  </FeatureItem>
                </CardContent>
                <CardFooter className="card-footer">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/register?plan=premium">Subscribe Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Family Plan - Shown below on mobile, side by side on desktop */}
              <Card className="card card-bordered md:col-span-3 mt-4 hover:shadow-md transition-shadow">
                <CardHeader className="card-header md:flex md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="card-title">Family Plan</CardTitle>
                    <CardDescription className="card-description">Perfect for households with multiple learners</CardDescription>
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
                <CardContent className="card-body">
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
                <CardFooter className="card-footer">
                  <Button className="w-full md:w-auto md:ml-auto btn btn-primary" asChild>
                    <Link href="/register?plan=family">Subscribe Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Educational Institution Plans */}
          <TabsContent value="education">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Classroom Plan */}
              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Classroom</CardTitle>
                  <CardDescription className="card-description">For individual teachers and classrooms</CardDescription>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">£299</div>
                    <div className="text-sm text-muted-foreground">per year, up to 30 students</div>
                  </div>
                </CardHeader>
                <CardContent className="card-body h-[380px] overflow-y-auto">
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
                  <FeatureItem tooltip="Align content with UK curriculum standards">
                    UK curriculum alignment tools
                  </FeatureItem>
                  <NotIncludedFeature>School-wide analytics</NotIncludedFeature>
                  <NotIncludedFeature>Administrator dashboard</NotIncludedFeature>
                  <NotIncludedFeature>Custom branding</NotIncludedFeature>
                </CardContent>
                <CardFooter className="card-footer">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/contact?plan=classroom">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* School Plan */}
              <Card className="card card-bordered border-primary hover:shadow-md transition-shadow">
                <CardHeader className="card-header">
                  <div className="flex justify-between items-center">
                    <CardTitle className="card-title">School</CardTitle>
                    <Badge className="badge badge-primary">Recommended</Badge>
                  </div>
                  <CardDescription className="card-description">For entire schools</CardDescription>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">Custom</div>
                    <div className="text-sm text-muted-foreground">Based on school size</div>
                  </div>
                </CardHeader>
                <CardContent className="card-body h-[380px] overflow-y-auto">
                  <FeatureItem>All Classroom features</FeatureItem>
                  <FeatureItem tooltip="Analytics across the entire school">
                    School-wide analytics
                  </FeatureItem>
                  <FeatureItem tooltip="Dashboard for school administrators">
                    Administrator dashboard
                  </FeatureItem>
                  <FeatureItem tooltip="Custom branding for your school">
                    Custom branding options
                  </FeatureItem>
                  <FeatureItem tooltip="Unlimited AI video generation credits">
                    Unlimited AI video generation
                  </FeatureItem>
                  <FeatureItem tooltip="Integration with school management systems">
                    School MIS integration
                  </FeatureItem>
                  <FeatureItem tooltip="Dedicated account manager for your school">
                    Dedicated account manager
                  </FeatureItem>
                  <FeatureItem tooltip="Professional development for teachers">
                    Teacher training & CPD
                  </FeatureItem>
                </CardContent>
                <CardFooter className="card-footer">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/contact?plan=school">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Multi-Academy Trust Plan */}
              <Card className="card card-bordered hover:shadow-md transition-shadow">
                <CardHeader className="card-header">
                  <CardTitle className="card-title">Multi-Academy Trust</CardTitle>
                  <CardDescription className="card-description">For MATs and school groups</CardDescription>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">Custom</div>
                    <div className="text-sm text-muted-foreground">Based on trust size</div>
                  </div>
                </CardHeader>
                <CardContent className="card-body h-[380px] overflow-y-auto">
                  <FeatureItem>All School features</FeatureItem>
                  <FeatureItem tooltip="Analytics across the entire trust">
                    Trust-wide analytics
                  </FeatureItem>
                  <FeatureItem tooltip="Cross-school collaboration tools">
                    Cross-school collaboration
                  </FeatureItem>
                  <FeatureItem tooltip="Centralised management for all schools">
                    Centralised management
                  </FeatureItem>
                  <FeatureItem tooltip="Custom implementation and onboarding">
                    Custom implementation
                  </FeatureItem>
                  <FeatureItem tooltip="Strategic partnership and roadmap input">
                    Strategic partnership
                  </FeatureItem>
                  <FeatureItem tooltip="Custom feature development for your trust">
                    Custom feature development
                  </FeatureItem>
                  <FeatureItem tooltip="Comprehensive data protection and compliance">
                    Enhanced data protection
                  </FeatureItem>
                </CardContent>
                <CardFooter className="card-footer">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/contact?plan=mat">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* FAQ Section */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I change plans later?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How do AI video credits work?</h3>
            <p className="text-muted-foreground">
              Each credit allows you to generate one custom AI video with our platform. Credits reset monthly and unused credits do not roll over.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Is there a discount for educational institutions?</h3>
            <p className="text-muted-foreground">
              Yes, we offer special pricing for schools, colleges, and universities. Contact our sales team for a customised quote.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How does the Family Plan work?</h3>
            <p className="text-muted-foreground">
              The Family Plan allows up to 5 user profiles with separate logins, progress tracking, and personalised experiences, while sharing a pool of AI video credits.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Is the content aligned with UK curriculum?</h3>
            <p className="text-muted-foreground">
              Yes, all our educational content is carefully aligned with the UK National Curriculum and examination boards including AQA, Edexcel, and OCR.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Do you offer a free trial?</h3>
            <p className="text-muted-foreground">
              Yes, all paid plans include a 14-day free trial. You can explore all features before being charged, and cancel anytime during the trial period.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20 bg-primary/5 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Learning?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of students, families, and schools already using EdPsych Connect to enhance educational outcomes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn btn-lg btn-primary" asChild>
            <Link href="/register">Get Started Today</Link>
          </Button>
          <Button size="lg" variant="outline" className="btn btn-lg btn-outline" asChild>
            <Link href="/contact">Contact Our Team</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
