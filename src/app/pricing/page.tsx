'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, X, Info, Shield, Users, GraduationCap, Building2,
  Sparkles, Brain, Clock, Award, Star, ArrowRight,
  Calculator, TrendingUp, School, Calendar, Gift,
  Zap, Lock, HeartHandshake, ChevronDown, ChevronUp
} from 'lucide-react';

// Pricing research and strategy
const pricingStrategy = {
  marketAnalysis: {
    competitors: [
      { name: 'TES Resources', price: '£30-50/month', features: 'Teaching resources only' },
      { name: 'Twinkl', price: '£4.49-29.99/month', features: 'Worksheets and activities' },
      { name: 'SENECA Learning', price: '£71.88/year', features: 'Revision platform' },
      { name: 'Century Tech', price: '£7-12/student/year', features: 'AI learning platform' },
      { name: 'Pearson Platforms', price: '£100-500/school/year', features: 'Educational tools' }
    ],
    ourValue: '31 knowledge bases + AI Avatar + 200+ features + Clinical tools = 10x competitor value'
  },
  costAnalysis: {
    infrastructure: '£5,000/month (AWS, Vercel, Database)',
    aiCosts: '£3,000/month (AI Avatar, NLP processing)',
    development: '£8,000/month (Maintenance, updates)',
    support: '£4,000/month (Customer service)',
    marketing: '£5,000/month',
    total: '£25,000/month minimum operational costs'
  },
  revenueTargets: {
    breakEven: '250 professional subscriptions or 50 school licenses',
    profitable: '500 professional subscriptions or 100 school licenses',
    target: '£100,000/month revenue within 12 months'
  }
};

// Feature type definition
interface PlanFeature {
  name: string;
  included: boolean;
  info?: string;
}

// Academic calendar-based pricing
const pricingPlans: Array<{
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  yearlyPrice?: string;
  termlyPrice?: string;
  academicPricing?: boolean;
  minUsers?: number;
  maxUsers?: number;
  color: string;
  features: PlanFeature[];
  cta: string;
  popular: boolean;
  badge?: string;
  enterprise?: boolean;
}> = [
  {
    id: 'free-trial',
    name: 'Free Trial',
    description: '14-day full access to explore our platform',
    price: '£0',
    period: '14 days',
    color: 'from-gray-600 to-gray-700',
    features: [
      { name: 'Access to 5 Knowledge Bases', included: true, info: 'ADHD, Autism, Dyslexia, Anxiety, Behavioral' },
      { name: 'Basic AI Avatar Interaction', included: true, info: '10 queries per day' },
      { name: '3 Assessment Tools', included: true, info: 'Cognitive, Behavioral, Emotional' },
      { name: 'Sample Resources & Worksheets', included: true },
      { name: 'Progress Tracking Dashboard', included: true },
      { name: 'Community Forum Access', included: true },
      { name: 'Advanced AI Avatar Features', included: false },
      { name: 'Full Assessment Suite', included: false },
      { name: 'Clinical Tools', included: false },
      { name: 'Priority Support', included: false }
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    id: 'individual',
    name: 'Individual Professional',
    description: 'For teachers, therapists, and education professionals',
    price: '£49',
    period: 'per month',
    yearlyPrice: '£441',
    termlyPrice: '£147',
    academicPricing: true,
    color: 'from-blue-600 to-cyan-600',
    features: [
      { name: 'All 31 Knowledge Bases', included: true },
      { name: 'Standard AI Avatar Access', included: true, info: '100 queries per day' },
      { name: 'Full Assessment Suite (20+ tools)', included: true },
      { name: 'Downloadable Resources', included: true },
      { name: 'Progress Tracking & Reports', included: true },
      { name: 'CPD Certificates', included: true },
      { name: 'Email Support', included: true },
      { name: 'Advanced AI Avatar Features', included: false, info: 'Voice, video, emotion recognition' },
      { name: 'Clinical Documentation Tools', included: false },
      { name: 'Multi-User Management', included: false }
    ],
    cta: 'Choose Billing Cycle',
    popular: false
  },
  {
    id: 'enhanced',
    name: 'Enhanced Professional',
    description: 'For specialists requiring advanced features',
    price: '£99',
    period: 'per month',
    yearlyPrice: '£891',
    termlyPrice: '£297',
    academicPricing: true,
    color: 'from-purple-600 to-pink-600',
    features: [
      { name: 'Everything in Individual', included: true },
      { name: 'Advanced AI Avatar Features', included: true, info: 'Unlimited queries, voice, video, emotion recognition' },
      { name: 'Clinical Documentation Suite', included: true },
      { name: 'Advanced Analytics & Insights', included: true },
      { name: 'Custom Assessment Creation', included: true },
      { name: 'Priority Email & Chat Support', included: true },
      { name: 'Collaboration Tools', included: true },
      { name: 'API Access (Limited)', included: true },
      { name: 'White-label Options', included: false },
      { name: 'Dedicated Account Manager', included: false }
    ],
    cta: 'Choose Billing Cycle',
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'school',
    name: 'School License',
    description: 'Whole school access with admin dashboard',
    price: '£299',
    period: 'per month',
    yearlyPrice: '£2,691',
    termlyPrice: '£897',
    academicPricing: true,
    minUsers: 50,
    maxUsers: 500,
    color: 'from-green-600 to-emerald-600',
    features: [
      { name: 'Up to 500 Users', included: true },
      { name: 'Everything in Enhanced', included: true },
      { name: 'School Admin Dashboard', included: true },
      { name: 'Bulk User Management', included: true },
      { name: 'School-wide Analytics', included: true },
      { name: 'Parent Portal Access', included: true },
      { name: 'Staff Training (3 sessions/term)', included: true },
      { name: 'Integration Support', included: true },
      { name: 'Dedicated Support Channel', included: true },
      { name: 'Custom Branding Options', included: true }
    ],
    cta: 'Get School Quote',
    popular: false
  },
  {
    id: 'district',
    name: 'District/Trust License',
    description: 'Multi-school deployment with central management',
    price: 'Custom',
    period: 'per academic year',
    color: 'from-amber-600 to-orange-600',
    features: [
      { name: 'Unlimited Users', included: true },
      { name: 'Everything in School License', included: true },
      { name: 'Central Management Console', included: true },
      { name: 'Cross-School Analytics', included: true },
      { name: 'Custom AI Training', included: true },
      { name: 'White-Label Platform', included: true },
      { name: 'Dedicated Success Team', included: true },
      { name: 'On-Site Training Available', included: true },
      { name: 'SLA Guaranteed Uptime', included: true },
      { name: 'Custom Feature Development', included: true }
    ],
    cta: 'Contact Sales',
    popular: false,
    enterprise: true
  }
];

// Free trial limitations
const freeTrialLimitations = {
  knowledgeBases: ['ADHD', 'Autism', 'Dyslexia', 'Anxiety', 'Behavioral Management'],
  aiQueries: 10,
  assessmentTools: ['Basic Cognitive Screen', 'Behavioral Checklist', 'Emotional Wellbeing Scale'],
  features: {
    reports: 'Watermarked',
    downloads: 'Limited to 5 per day',
    support: 'Community forum only'
  }
};

// Academic term options
const academicTerms = [
  { id: 'monthly', name: 'Monthly', description: 'Flexible month-to-month', multiplier: 1 },
  { id: 'termly', name: 'Per Term', description: '3 months (Save 20%)', multiplier: 3, discount: 0.2 },
  { id: 'yearly', name: 'Academic Year', description: '9 months (Save 25%)', multiplier: 9, discount: 0.25 },
  { id: 'full-year', name: 'Full Year', description: '12 months (Save 30%)', multiplier: 12, discount: 0.3 }
];

// ROI Calculator component
function ROICalculator() {
  const [students, setStudents] = useState(100);
  const [senPercentage, setSenPercentage] = useState(20);
  const [hoursSaved, setHoursSaved] = useState(5);
  
  const senStudents = Math.round(students * (senPercentage / 100));
  const weeklySavings = hoursSaved * 40; // £40/hour for teacher time
  const termSavings = weeklySavings * 12; // 12 weeks per term
  const yearSavings = termSavings * 3;
  const costPerStudent = 299 * 12 / students; // School license yearly cost
  const roi = ((yearSavings - (299 * 12)) / (299 * 12) * 100).toFixed(0);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Calculator className="w-7 h-7 text-yellow-400" />
        ROI Calculator
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="text-white font-medium mb-2 block">
            Number of Students in School
          </label>
          <input
            type="range"
            min="50"
            max="1000"
            value={students}
            onChange={(e) => setStudents(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-gray-300 text-sm mt-1">
            <span>50</span>
            <span className="text-yellow-400 font-bold">{students} students</span>
            <span>1000</span>
          </div>
        </div>

        <div>
          <label className="text-white font-medium mb-2 block">
            Percentage with SEN/Additional Needs
          </label>
          <input
            type="range"
            min="10"
            max="40"
            value={senPercentage}
            onChange={(e) => setSenPercentage(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-gray-300 text-sm mt-1">
            <span>10%</span>
            <span className="text-yellow-400 font-bold">{senPercentage}% ({senStudents} students)</span>
            <span>40%</span>
          </div>
        </div>

        <div>
          <label className="text-white font-medium mb-2 block">
            Hours Saved Per Week
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={hoursSaved}
            onChange={(e) => setHoursSaved(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-gray-300 text-sm mt-1">
            <span>1 hour</span>
            <span className="text-yellow-400 font-bold">{hoursSaved} hours</span>
            <span>20 hours</span>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Weekly Time Savings</p>
              <p className="text-2xl font-bold text-white">£{weeklySavings.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Yearly Savings</p>
              <p className="text-2xl font-bold text-green-400">£{yearSavings.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
            <p className="text-sm text-gray-300 mb-1">Return on Investment</p>
            <p className="text-3xl font-bold text-green-400">{roi}% ROI</p>
            <p className="text-sm text-gray-300 mt-1">
              Cost per student: £{costPerStudent.toFixed(2)}/year
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Comparison table component
function ComparisonTable() {
  const features = [
    { category: 'Knowledge Bases', free: '5 bases', individual: 'All 31 bases', enhanced: 'All 31 bases', school: 'All 31 bases' },
    { category: 'AI Avatar Queries', free: '10/day', individual: '100/day', enhanced: 'Unlimited', school: 'Unlimited' },
    { category: 'Voice & Video AI', free: '❌', individual: '❌', enhanced: '✅', school: '✅' },
    { category: 'Assessment Tools', free: '3 tools', individual: '20+ tools', enhanced: '20+ tools + custom', school: '20+ tools + custom' },
    { category: 'User Accounts', free: '1', individual: '1', enhanced: '1', school: 'Up to 500' },
    { category: 'Progress Reports', free: 'Basic', individual: 'Detailed', enhanced: 'Advanced Analytics', school: 'School-wide Analytics' },
    { category: 'Support', free: 'Forum', individual: 'Email', enhanced: 'Priority', school: 'Dedicated' },
    { category: 'CPD Certificates', free: '❌', individual: '✅', enhanced: '✅', school: '✅' },
    { category: 'API Access', free: '❌', individual: '❌', enhanced: 'Limited', school: 'Full' },
    { category: 'Training', free: '❌', individual: 'Self-serve', enhanced: 'Webinars', school: 'On-site available' }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left py-4 px-4 text-white font-semibold">Feature</th>
            <th className="text-center py-4 px-4 text-gray-400">Free Trial</th>
            <th className="text-center py-4 px-4 text-blue-400">Individual</th>
            <th className="text-center py-4 px-4 text-purple-400">Enhanced</th>
            <th className="text-center py-4 px-4 text-green-400">School</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className="border-b border-white/10">
              <td className="py-4 px-4 text-gray-300">{feature.category}</td>
              <td className="text-center py-4 px-4 text-gray-400">{feature.free}</td>
              <td className="text-center py-4 px-4 text-white">{feature.individual}</td>
              <td className="text-center py-4 px-4 text-white">{feature.enhanced}</td>
              <td className="text-center py-4 px-4 text-white">{feature.school}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const calculatePrice = (plan: any) => {
    if (!plan.academicPricing) return plan.price;
    
    const term = academicTerms.find(t => t.id === billingCycle);
    if (!term) return plan.price;
    
    const baseMonthlyPrice = parseFloat(plan.price.replace('£', ''));
    const totalPrice = baseMonthlyPrice * term.multiplier * (1 - (term.discount || 0));
    
    return `£${Math.round(totalPrice)}`;
  };

  const calculateMonthlyPrice = (plan: any) => {
    if (!plan.academicPricing) return plan.price;
    
    const term = academicTerms.find(t => t.id === billingCycle);
    if (!term) return plan.price;
    
    const baseMonthlyPrice = parseFloat(plan.price.replace('£', ''));
    const monthlyPrice = baseMonthlyPrice * (1 - (term.discount || 0));
    
    return `£${Math.round(monthlyPrice)}`;
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header is handled by layout */}

      {/* Hero Section */}
      <section className="py-section section-accent">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Transparent, Academic-Friendly Pricing
          </h1>
          <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto">
            Designed for the education sector with flexible term-based billing. 
            Start with a free trial and scale as you grow.
          </p>
          
          {/* Value Proposition */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="card">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-primary font-semibold">{pricingStrategy.revenueTargets.breakEven}</p>
              <p className="text-xs text-muted">to break even</p>
            </div>
            <div className="card">
              <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-primary font-semibold">10x More Value</p>
              <p className="text-xs text-muted">than competitors</p>
            </div>
            <div className="card">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-primary font-semibold">DfE Compliant</p>
              <p className="text-xs text-muted">Full safeguarding</p>
            </div>
            <div className="card">
              <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-primary font-semibold">Evidence-Based</p>
              <p className="text-xs text-muted">Clinical standards</p>
            </div>
          </div>

          {/* Billing Cycle Selector */}
          <div className="inline-flex bg-secondary rounded-2xl p-1 border border-default">
            {academicTerms.map((term) => (
              <button
                key={term.id}
                onClick={() => setBillingCycle(term.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  billingCycle === term.id
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-primary/10'
                }`}
              >
                <span className="block">{term.name}</span>
                {term.discount && (
                  <span className="text-xs opacity-80">Save {term.discount * 100}%</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-section bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative card p-6 border-2 ${
                  plan.popular ? 'border-primary shadow-lg' : 'border-default'
                } hover:scale-105 transition-all`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 badge px-4 py-1 text-sm font-bold">
                    {plan.badge}
                  </div>
                )}
                
                <div className={`w-full h-2 bg-primary rounded-full mb-4`} />
                
                <h3 className="text-xl font-bold text-primary mb-2">{plan.name}</h3>
                <p className="text-sm text-secondary mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  {plan.enterprise ? (
                    <div>
                      <span className="text-3xl font-bold text-primary">Custom</span>
                      <p className="text-sm text-secondary mt-1">Contact for quote</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-primary">
                        {plan.academicPricing ? calculateMonthlyPrice(plan) : plan.price}
                      </span>
                      <span className="text-secondary text-sm"> {plan.period}</span>
                      {plan.academicPricing && billingCycle !== 'monthly' && (
                        <p className="text-sm text-primary font-medium mt-1">
                          Total: {calculatePrice(plan)} for {academicTerms.find(t => t.id === billingCycle)?.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Feature highlights */}
                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-secondary' : 'text-muted'}>
                        {feature.name}
                      </span>
                      {feature.info && (
                        <div className="group relative">
                          <Info className="w-3 h-3 text-muted cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-primary text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {feature.info}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 font-semibold rounded-xl transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : plan.enterprise
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-secondary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* View all features */}
                <button
                  onClick={() => setShowComparison(true)}
                  className="w-full mt-2 text-xs text-muted hover:text-primary transition-colors"
                >
                  View all features →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-section section-accent">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6">
                Calculate Your Return on Investment
              </h2>
              <p className="text-xl text-secondary mb-8">
                See how EdPsych Connect pays for itself through time savings and improved outcomes.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">Save Teacher Time</h3>
                    <p className="text-gray-400">Average 5-10 hours per week on SEN administration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">Improve Student Outcomes</h3>
                    <p className="text-gray-400">Early intervention leads to better progress</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">Reduce External Costs</h3>
                    <p className="text-gray-400">Less need for external EP consultations</p>
                  </div>
                </div>
              </div>

              {/* Market Comparison */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="font-semibold text-white mb-4">Market Comparison</h4>
                <div className="space-y-2">
                  {pricingStrategy.marketAnalysis.competitors.map((comp, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-400">{comp.name}</span>
                      <span className="text-white">{comp.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-yellow-400">EdPsych Connect</span>
                      <span className="text-yellow-400">10x More Value</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ROICalculator />
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      {showComparison && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 max-w-6xl w-full border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-white">Feature Comparison</h3>
                <button
                  onClick={() => setShowComparison(false)}
                  className="p-2 text-white hover:text-yellow-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <ComparisonTable />
              
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowComparison(false)}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 font-bold rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all"
                >
                  Close Comparison
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-section bg-primary">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="card group">
              <summary className="cursor-pointer flex justify-between items-center text-primary font-semibold">
                What's included in the free trial?
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4 text-secondary">
                <p>The 14-day free trial includes:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Access to 5 core knowledge bases (ADHD, Autism, Dyslexia, Anxiety, Behavioral)</li>
                  <li>10 AI Avatar queries per day</li>
                  <li>3 basic assessment tools</li>
                  <li>Sample resources and worksheets</li>
                  <li>Progress tracking dashboard</li>
                </ul>
                <p className="mt-2">No credit card required to start your trial.</p>
              </div>
            </details>

            <details className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group">
              <summary className="cursor-pointer flex justify-between items-center text-white font-semibold">
                Why is the AI Avatar a premium feature?
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4 text-gray-300">
                <p>The advanced AI Avatar features (voice, video, emotion recognition) require significant computational resources:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Real-time natural language processing</li>
                  <li>Voice synthesis and recognition</li>
                  <li>Video processing and emotion detection</li>
                  <li>Personalized response generation</li>
                </ul>
                <p className="mt-2">Basic text interactions are available in all paid plans, with enhanced features in our Enhanced and School tiers.</p>
              </div>
            </details>

            <details className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group">
              <summary className="cursor-pointer flex justify-between items-center text-white font-semibold">
                How does academic term billing work?
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4 text-gray-300">
                <p>We offer flexible billing aligned with the academic calendar:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Monthly:</strong> Pay as you go, cancel anytime</li>
                  <li><strong>Per Term:</strong> 3 months, save 20%</li>
                  <li><strong>Academic Year:</strong> 9 months (Sept-May), save 25%</li>
                  <li><strong>Full Year:</strong> 12 months, save 30%</li>
                </ul>
                <p className="mt-2">Schools can align billing with their budget cycles.</p>
              </div>
            </details>

            <details className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group">
              <summary className="cursor-pointer flex justify-between items-center text-white font-semibold">
                Can we get a custom quote for our school?
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4 text-gray-300">
                <p>Yes! We offer custom pricing for:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Schools with over 500 users</li>
                  <li>Multi-academy trusts</li>
                  <li>Local education authorities</li>
                  <li>Special requirements or integrations</li>
                </ul>
                <p className="mt-2">Contact our education team for a personalized quote and demo.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section section-accent">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="card p-12 bg-accent">
            <Gift className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-primary mb-6">
              Start Your 14-Day Free Trial Today
            </h2>
            <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
              Experience the power of 31 knowledge bases, AI-powered support, and comprehensive assessment tools. 
              No credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/register"
                className="group px-8 py-4 btn-primary font-bold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-secondary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all border border-default"
              >
                Schedule School Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer handled by layout */}
    </div>
  );
}