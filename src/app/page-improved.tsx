'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { 
  Shield,
  Lock,
  Users,
  CheckCircle,
  Heart,
  Eye,
  BookOpen,
  BarChart,
  Brain,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  Accessibility
} from 'lucide-react';

export default function ImprovedLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with Security Badge */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">EdPsych AI</span>
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              DfE Compliant
            </span>
          </div>
          
          <nav className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-primary">
              Home
            </Link>
            <Link href="/features" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">
              Features
            </Link>
            <Link href="/security" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">
              Security
            </Link>
            <Link href="/safeguarding" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">
              Safeguarding
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary">
              About
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <Link href="/api/gdpr/privacy-policy?format=html" className="text-sm text-muted-foreground hover:text-primary mr-4">
              Privacy
            </Link>
            <Link href="/auth/gateway">
              <Button variant="outline" size="sm" className="mr-2">Sign In</Button>
            </Link>
            <Link href="/auth/gateway?mode=signup">
              <Button size="sm">Get Started Safely</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section - Security First */}
      <section className="py-12 md:py-24 bg-gradient-to-b from-background to-muted/50">
        <div className="container">
          <div className="flex justify-center mb-8">
            <div className="flex gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <Shield className="h-4 w-4" />
                DfE Approved
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <Lock className="h-4 w-4" />
                GDPR Compliant
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                <Heart className="h-4 w-4" />
                Child Safe
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                <Accessibility className="h-4 w-4" />
                WCAG 2.1 AA
              </div>
            </div>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <Heading level="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              The Secure AI Platform Built for Education
            </Heading>
            <Text className="text-xl text-muted-foreground mb-8">
              Transform learning with AI that puts student safety first. Trusted by schools across the UK 
              with enterprise-grade security, comprehensive safeguarding, and full regulatory compliance.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/gateway?mode=signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Secure Trial
                </Button>
              </Link>
              <Link href="/security">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Security Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Indicators */}
      <section className="py-8 bg-muted/50 border-y">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">256-bit</div>
              <div className="text-sm text-muted-foreground">Encryption</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Safeguarding Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">GDPR Compliant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">WCAG 2.1</div>
              <div className="text-sm text-muted-foreground">Accessibility</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Security Features */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <Heading level="h2" className="text-3xl font-bold mb-4">
              Security & Safeguarding at Our Core
            </Heading>
            <Text className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every feature is designed with student safety and data protection in mind, 
              exceeding DfE requirements and industry standards.
            </Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Safeguarding */}
            <Card className="border-2 border-red-100 hover:border-red-200 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-red-100 w-12 h-12 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <Heading level="h3" className="text-xl font-bold mb-2">
                  Advanced Safeguarding
                </Heading>
                <Text className="text-muted-foreground mb-4">
                  Real-time content monitoring with immediate DSL alerts for concerning behavior. 
                  Automatic escalation ensures rapid response to safeguarding issues.
                </Text>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    24/7 content monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Instant DSL notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Comprehensive audit trail
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Age Verification */}
            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <Heading level="h3" className="text-xl font-bold mb-2">
                  Age-Appropriate Access
                </Heading>
                <Text className="text-muted-foreground mb-4">
                  Robust age verification with parental consent workflow for under-16s. 
                  Ensures compliance with data protection laws for children.
                </Text>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Age verification gateway
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Parental consent system
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Role-based permissions
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Data Protection */}
            <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <Heading level="h3" className="text-xl font-bold mb-2">
                  Enterprise Security
                </Heading>
                <Text className="text-muted-foreground mb-4">
                  Bank-level encryption, secure authentication, and comprehensive GDPR tools 
                  protect personal data at every level.
                </Text>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    256-bit encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Data export & deletion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Rate limiting & DDoS protection
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Educational Features */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <Heading level="h2" className="text-3xl font-bold mb-4">
              Powerful Learning Tools, Safely Delivered
            </Heading>
            <Text className="text-xl text-muted-foreground max-w-3xl mx-auto">
              All our educational features are built on our secure foundation, 
              ensuring learning happens in a protected environment.
            </Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <BookOpen className="h-8 w-8 text-primary mb-4" />
                <Heading level="h3" className="text-lg font-bold mb-2">
                  Adaptive Learning
                </Heading>
                <Text className="text-muted-foreground text-sm">
                  AI-powered content that adapts to each student's needs while maintaining 
                  strict content filtering and age-appropriate boundaries.
                </Text>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Brain className="h-8 w-8 text-primary mb-4" />
                <Heading level="h3" className="text-lg font-bold mb-2">
                  Smart Assessments
                </Heading>
                <Text className="text-muted-foreground text-sm">
                  Generate fair, accessible assessments with built-in accommodations 
                  for different learning needs and SEND requirements.
                </Text>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <BarChart className="h-8 w-8 text-primary mb-4" />
                <Heading level="h3" className="text-lg font-bold mb-2">
                  Progress Insights
                </Heading>
                <Text className="text-muted-foreground text-sm">
                  Track learning progress with privacy-preserving analytics that 
                  give insights without compromising student data.
                </Text>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Compliance Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Heading level="h2" className="text-3xl font-bold mb-6">
                Built for UK Education Standards
              </Heading>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <Text className="font-semibold">DfE Compliant</Text>
                    <Text className="text-sm text-muted-foreground">
                      Meets all Department for Education requirements for educational technology
                    </Text>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <Text className="font-semibold">UK GDPR Ready</Text>
                    <Text className="text-sm text-muted-foreground">
                      Full compliance with UK data protection laws including special provisions for children
                    </Text>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <Text className="font-semibold">Keeping Children Safe in Education</Text>
                    <Text className="text-sm text-muted-foreground">
                      Aligned with KCSIE guidelines for online safety and safeguarding
                    </Text>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <Text className="font-semibold">WCAG 2.1 Level AA</Text>
                    <Text className="text-sm text-muted-foreground">
                      Fully accessible to all learners including those with disabilities
                    </Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <Eye className="h-12 w-12 text-primary mb-4" />
              <Heading level="h3" className="text-xl font-bold mb-4">
                Transparency First
              </Heading>
              <Text className="text-muted-foreground mb-6">
                We believe in complete transparency about how we protect your data and students.
              </Text>
              <div className="space-y-3">
                <Link href="/api/gdpr/privacy-policy?format=html" className="flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  Read our Privacy Policy
                </Link>
                <Link href="/security/audit" className="flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  View Security Audit Results
                </Link>
                <Link href="/safeguarding/policy" className="flex items-center gap-2 text-primary hover:underline">
                  <ArrowRight className="h-4 w-4" />
                  Safeguarding Procedures
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <Heading level="h2" className="text-3xl font-bold mb-4">
            Start Your Secure Educational Journey
          </Heading>
          <Text className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of UK schools already using EdPsych AI to deliver 
            personalized learning in a safe, compliant environment.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/gateway?mode=signup">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Start 30-Day Free Trial
              </Button>
            </Link>
            <Link href="/demo/request">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Request School Demo
              </Button>
            </Link>
          </div>
          <Text className="text-sm mt-6 text-primary-foreground/70">
            No credit card required • Full security features included • Cancel anytime
          </Text>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">EdPsych AI</span>
              </div>
              <Text className="text-muted-foreground mb-4 text-sm">
                The secure AI platform built for UK education.
              </Text>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  DfE Compliant
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  ISO 27001 Certified
                </div>
              </div>
            </div>
            
            <div>
              <Heading level="h3" className="text-lg font-bold mb-4">Security</Heading>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/security" className="text-muted-foreground hover:text-primary">
                    Security Overview
                  </Link>
                </li>
                <li>
                  <Link href="/api/gdpr/privacy-policy?format=html" className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/gdpr" className="text-muted-foreground hover:text-primary">
                    GDPR Rights
                  </Link>
                </li>
                <li>
                  <Link href="/safeguarding" className="text-muted-foreground hover:text-primary">
                    Safeguarding
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <Heading level="h3" className="text-lg font-bold mb-4">Support</Heading>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-muted-foreground hover:text-primary">
                    System Status
                  </Link>
                </li>
                <li>
                  <a href="mailto:dsl@edpsych-ai.edu" className="text-muted-foreground hover:text-primary">
                    Report Concern
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <Heading level="h3" className="text-lg font-bold mb-4">Company</Heading>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="text-muted-foreground hover:text-primary">
                    Compliance
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="text-muted-foreground hover:text-primary">
                    Accessibility
                  </Link>
                </li>
                <li>
                  <a href="mailto:dpo@edpsych-ai.edu" className="text-muted-foreground hover:text-primary">
                    Data Protection
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <Text>&copy; {new Date().getFullYear()} EdPsych AI. All rights reserved. 
            Built with security and student safety at heart.</Text>
          </div>
        </div>
      </footer>
    </div>
  );
}