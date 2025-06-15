'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VideoPlaceholder from '@/components/ui/video-placeholder';
import {
  Brain, Shield, Users, BookOpen, Award, Zap, Globe, Heart,
  Lock, Star, ChevronRight, Play, Sparkles, Target,
  GraduationCap, MessageSquare, BarChart3, Puzzle,
  HeartHandshake, TrendingUp, UserCheck, ArrowRight,
  CheckCircle2, Clock, Headphones, FileText, Search,
  Lightbulb, Rocket, Building2, Phone, Mail, MapPin,
  Facebook, Twitter, Linkedin, Youtube, Instagram,
  Menu, X, ChevronDown, Activity, Microscope,
  Stethoscope, Calculator, Palette, Music, Gamepad2,
  Languages, Database, Cloud, Smartphone, Laptop,
  Settings, HelpCircle, AlertCircle, Info, Key,
  Calendar, Gift, User, Volume2
} from '@/components/ui/icons';
import CookieConsent from '@/components/CookieConsent';

// Feature categories with all 200+ features
const featureCategories = [
  {
    id: 'knowledge-bases',
    title: '31 Comprehensive Knowledge Bases',
    icon: Brain,
    color: 'from-purple-600 to-indigo-600',
    description: 'Expert-curated content covering every aspect of educational psychology',
    features: [
      'ADHD Assessment & Management',
      'Autism Spectrum Disorder Support',
      'Dyslexia Intervention Strategies',
      'Behavioral Management Techniques',
      'Emotional Regulation Tools',
      'Executive Function Development',
      'Social Skills Training',
      'Anxiety & Depression Support',
      'Trauma-Informed Practices',
      'Sensory Processing Resources',
      'Learning Disabilities Framework',
      'Gifted Education Strategies',
      'Speech & Language Development',
      'Motor Skills Enhancement',
      'Cognitive Assessment Tools',
      'Memory Enhancement Techniques',
      'Attention Training Programs',
      'Self-Esteem Building',
      'Peer Relationship Support',
      'Family Dynamics Guidance',
      'School Refusal Strategies',
      'Bullying Prevention & Response',
      'Digital Wellbeing',
      'Sleep Hygiene Education',
      'Nutrition & Learning',
      'Physical Activity Integration',
      'Mindfulness Practices',
      'Creative Therapies',
      'Play-Based Learning',
      'Transition Support',
      'Career Guidance'
    ]
  },
  {
    id: 'ai-avatar',
    title: 'Dr. Scott I-Patrick AI Avatar',
    icon: Sparkles,
    color: 'from-pink-600 to-rose-600',
    description: 'Professional AI-powered guidance with decades of expertise',
    features: [
      '24/7 Expert Availability',
      'Natural Language Processing',
      'Personalized Recommendations',
      'Video Consultations',
      'Voice Interaction',
      'Multi-language Support',
      'Emotion Recognition',
      'Adaptive Responses',
      'Case Study Analysis',
      'Research-Based Advice',
      'Clinical Insights',
      'Therapeutic Techniques',
      'Progress Monitoring',
      'Intervention Planning',
      'Report Generation'
    ]
  },
  {
    id: 'assessment-tools',
    title: 'Comprehensive Assessment Suite',
    icon: Target,
    color: 'from-green-600 to-emerald-600',
    description: 'Professional-grade assessment tools for accurate evaluation',
    features: [
      'Cognitive Ability Tests',
      'Behavioral Checklists',
      'Emotional Wellbeing Scales',
      'Learning Style Assessments',
      'Attention Deficit Screening',
      'Autism Spectrum Questionnaires',
      'Dyslexia Risk Assessment',
      'Social Skills Evaluation',
      'Executive Function Tests',
      'Memory Assessment Tools',
      'Processing Speed Tests',
      'Academic Achievement Tracking',
      'Developmental Milestones',
      'Sensory Profile Assessment',
      'Adaptive Behavior Scales',
      'Language Development Tests',
      'Motor Skills Evaluation',
      'School Readiness Checklist',
      'Career Interest Inventory',
      'Personality Assessments'
    ]
  },
  {
    id: 'parent-support',
    title: 'Parent & Family Support System',
    icon: HeartHandshake,
    color: 'from-amber-600 to-orange-600',
    description: 'Empowering parents with tools and knowledge',
    features: [
      'Parent Education Modules',
      'Home Strategy Guides',
      'Behavior Management at Home',
      'Homework Support Techniques',
      'Sibling Relationship Guidance',
      'Family Communication Tools',
      'Crisis Management Plans',
      'Advocacy Training',
      'IEP/EHCP Navigation',
      'School Collaboration Tips',
      'Support Group Access',
      'Parent Wellbeing Resources',
      'Respite Planning',
      'Financial Support Guidance',
      'Legal Rights Information',
      'Community Resources',
      'Emergency Contacts',
      'Progress Tracking Tools',
      'Celebration Strategies',
      'Self-Care for Parents'
    ]
  },
  {
    id: 'teacher-training',
    title: 'Professional Development for Educators',
    icon: GraduationCap,
    color: 'from-blue-600 to-cyan-600',
    description: 'Comprehensive training for teachers and education professionals',
    features: [
      'SEN Identification Training',
      'Inclusive Teaching Methods',
      'Differentiation Strategies',
      'Classroom Management',
      'Behavior Support Plans',
      'Communication Techniques',
      'Assessment Best Practices',
      'Technology Integration',
      'Collaborative Teaching',
      'Parent Engagement',
      'Legal Compliance Training',
      'Safeguarding Protocols',
      'Mental Health Awareness',
      'Trauma-Informed Teaching',
      'Cultural Sensitivity',
      'CPD Certification',
      'Peer Mentoring',
      'Research Updates',
      'Case Study Library',
      'Best Practice Sharing'
    ]
  },
  {
    id: 'student-tools',
    title: 'Interactive Student Resources',
    icon: Rocket,
    color: 'from-violet-600 to-purple-600',
    description: 'Engaging tools designed for student success',
    features: [
      'Study Skills Training',
      'Organization Tools',
      'Time Management Apps',
      'Focus Enhancement Games',
      'Memory Training Exercises',
      'Reading Comprehension Tools',
      'Writing Support Software',
      'Math Problem Solving',
      'Science Exploration Labs',
      'Creative Expression Tools',
      'Social Story Builder',
      'Emotion Recognition Games',
      'Mindfulness Activities',
      'Stress Management Tools',
      'Goal Setting Framework',
      'Progress Celebration',
      'Peer Connection Platform',
      'Self-Advocacy Training',
      'Career Exploration',
      'Life Skills Development'
    ]
  },
  {
    id: 'school-solutions',
    title: 'Whole School Implementation',
    icon: Building2,
    color: 'from-teal-600 to-green-600',
    description: 'Complete solutions for educational institutions',
    features: [
      'School-Wide Screening',
      'Staff Training Programs',
      'Policy Development Tools',
      'Intervention Tracking',
      'Multi-Tier Support System',
      'Data Analytics Dashboard',
      'Parent Portal Access',
      'Student Management System',
      'Resource Allocation Tools',
      'Compliance Monitoring',
      'Quality Assurance Framework',
      'External Agency Liaison',
      'Budget Planning Tools',
      'Impact Measurement',
      'Ofsted Preparation',
      'Governance Support',
      'Community Engagement',
      'Partnership Development',
      'Crisis Response Plans',
      'Continuous Improvement'
    ]
  },
  {
    id: 'clinical-features',
    title: 'Clinical & Therapeutic Tools',
    icon: Stethoscope,
    color: 'from-red-600 to-pink-600',
    description: 'Evidence-based clinical interventions and therapy resources',
    features: [
      'CBT Worksheets',
      'DBT Skills Training',
      'Play Therapy Resources',
      'Art Therapy Tools',
      'Music Therapy Integration',
      'Occupational Therapy Plans',
      'Speech Therapy Exercises',
      'Physiotherapy Programs',
      'Counseling Frameworks',
      'Group Therapy Guides',
      'Family Therapy Tools',
      'Medication Management',
      'Clinical Documentation',
      'Treatment Planning',
      'Progress Notes Templates',
      'Outcome Measures',
      'Risk Assessment Tools',
      'Safety Planning',
      'Discharge Planning',
      'Referral Pathways'
    ]
  }
];

// Statistics data
const statistics = [
  { value: '1.7M+', label: 'Children Supported', icon: Users },
  { value: '31', label: 'Knowledge Bases', icon: Brain },
  { value: '200+', label: 'Features Available', icon: Sparkles },
  { value: '24/7', label: 'Expert Support', icon: Clock },
  { value: '99.9%', label: 'Uptime Guarantee', icon: Shield },
  { value: '100%', label: 'DfE Compliant', icon: Award }
];

// Testimonials
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'SENCO, Primary School',
    content: 'EdPsych Connect has transformed how we support our SEN students. The comprehensive knowledge bases and AI avatar provide instant expert guidance.',
    rating: 5
  },
  {
    name: 'David Chen',
    role: 'Parent of Child with ADHD',
    content: 'Finally, a platform that understands our journey. The parent support tools and 24/7 access to expert advice have been life-changing for our family.',
    rating: 5
  },
  {
    name: 'Emma Williams',
    role: 'Educational Psychologist',
    content: 'The clinical tools and assessment suite are unparalleled. This platform sets a new standard for educational psychology support.',
    rating: 5
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeatureCategory, setActiveFeatureCategory] = useState('knowledge-bases');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform rotate-3 transition-transform hover:rotate-6 shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">EdPsych Connect</h1>
                  <p className="text-xs text-gray-600">Transforming Education Through AI</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#solutions"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Solutions
              </a>
              <a
                href="#testimonials"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Pricing
              </a>
              <Link
                href="/auth/login"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#solutions"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Solutions
              </a>
              <a
                href="#testimonials"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Pricing
              </a>
              <Link
                href="/auth/login"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-b from-white to-blue-50">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-200/20 rounded-full blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Crisis Alert Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full text-white mb-8 animate-bounce shadow-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Supporting 1.7M Children in Educational Crisis</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The UK's Most Comprehensive
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
              Educational Psychology Platform
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            31 Expert Knowledge Bases. 200+ Professional Features. One Unified Solution.
            <span className="block mt-2 text-lg text-gray-700 font-medium">Powered by Dr. Scott I-Patrick's AI Technology</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/auth/register"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => {
                const demoSection = document.getElementById('meet-dr-scott');
                if (demoSection) {
                  demoSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-300 flex items-center gap-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Meet Dr. Scott
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 transform hover:scale-105 transition-all"
              >
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              200+ Features Across 8 Core Areas
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Every tool, resource, and feature you need to support educational success
            </p>
          </div>

          {/* Feature Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {featureCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFeatureCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFeatureCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                <category.icon className="w-5 h-5 inline-block mr-2" />
                <span className="hidden sm:inline">{category.title}</span>
              </button>
            ))}
          </div>

          {/* Active Feature Category Display */}
          {featureCategories.map((category) => (
            <div
              key={category.id}
              className={`transition-all duration-500 ${
                activeFeatureCategory === category.id ? 'block' : 'hidden'
              }`}
            >
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-blue-50 transition-all border border-gray-200"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Dr Scott Section with Video Placeholder */}
      <section id="meet-dr-scott" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Dr. Scott I-Patrick
              <span className="block text-2xl mt-2 text-blue-600">Your AI Educational Psychologist</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Experience personalized guidance from our AI-powered educational psychologist. Dr. Scott provides 24/7 expert support,
              evidence-based recommendations, and compassionate assistance for students, parents, and educators.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <VideoPlaceholder
              title="Introduction to Dr. Scott I-Patrick"
              description="Learn about our founder and lead educational psychologist, his vision for educational support, and how the AI avatar can help you navigate educational challenges."
              duration="3-5 minutes"
              category="overview"
              thumbnailText="Dr. Scott Introduction Video"
            />
          </div>

          <div className="text-center mt-12">
            <Link
              href="/ask-dr-scott"
              className="inline-flex px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-xl items-center gap-2 justify-center"
            >
              <MessageSquare className="w-5 h-5" />
              Try Dr. Scott AI Avatar (Premium Feature)
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Complete Solutions for Every Stakeholder
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored platforms designed to meet the unique needs of each user group
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Students */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border-2 border-blue-200 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Students</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Interactive learning tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Personalized study plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Peer support network</span>
                </li>
              </ul>
            </div>

            {/* Parents */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-200 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Parents</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Home support strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Expert guidance 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Progress monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Support community</span>
                </li>
              </ul>
            </div>

            {/* Teachers */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-200 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Teachers</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Classroom management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>SEN identification tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>CPD certification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Resource library</span>
                </li>
              </ul>
            </div>

            {/* Schools */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-200 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Schools</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Whole-school analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Staff training programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Compliance tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Impact measurement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from educators, parents, and professionals who have transformed their practice
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Academic-Friendly Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible billing aligned with school terms. Start with a 14-day free trial.
            </p>
            
            {/* Pricing highlights */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-blue-100 rounded-full px-4 py-2 text-sm text-blue-800 font-medium">
                <Calendar className="w-4 h-4 inline mr-2" />
                Term & Annual Billing
              </div>
              <div className="bg-green-100 rounded-full px-4 py-2 text-sm text-green-800 font-medium">
                <Gift className="w-4 h-4 inline mr-2" />
                14-Day Free Trial
              </div>
              <div className="bg-purple-100 rounded-full px-4 py-2 text-sm text-purple-800 font-medium">
                <Shield className="w-4 h-4 inline mr-2" />
                No Credit Card Required
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Individual Professional Plan */}
            <div className="bg-gray-50 rounded-3xl p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Individual</h3>
              <p className="text-gray-600 mb-6">For teachers & therapists</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">£49</span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-blue-600 mt-2 font-medium">Save 25% with annual billing</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>All 31 Knowledge Bases</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Standard AI Avatar (100/day)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>20+ Assessment Tools</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>CPD Certificates</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Email Support</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-all text-center"
              >
                View Details
              </Link>
            </div>

            {/* Enhanced Professional Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-400 hover:shadow-2xl transition-all relative transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enhanced</h3>
              <p className="text-gray-600 mb-6">Advanced AI features</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">£99</span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-blue-600 mt-2 font-medium">Save 25% with annual billing</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Everything in Individual</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Advanced AI Avatar (Voice/Video)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Clinical Documentation</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Advanced Analytics</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Priority Support</span>
                </li>
              </ul>
              <Link
                href="/auth/register"
                className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 text-center shadow-lg"
              >
                Get Started
              </Link>
            </div>

            {/* School Plan */}
            <div className="bg-gray-50 rounded-3xl p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">School License</h3>
              <p className="text-gray-600 mb-6">Whole school access</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">£299</span>
                <span className="text-gray-600">/month</span>
                <p className="text-sm text-blue-600 mt-2 font-medium">Academic year discounts</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Up to 500 Users</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>School Dashboard</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Parent Portal</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Staff Training</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Dedicated Support</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="block w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all text-center"
              >
                Get Quote
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              View detailed pricing & ROI calculator
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Join the Educational Revolution
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Be part of the solution. Help 1.7 million children access the support they need.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/auth/register"
                  className="group px-8 py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
                >
                  Start Your Free Trial
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-transparent text-white font-bold rounded-lg hover:bg-white/20 transition-all border-2 border-white flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Schedule a Demo
                </Link>
              </div>

              <p className="mt-6 text-sm text-white/80">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">EdPsych Connect</h3>
              </div>
              <p className="text-gray-400 mb-4">
                The UK's most comprehensive educational psychology platform, supporting 1.7M+ children.
              </p>
              <div className="flex gap-3">
                <a href="https://facebook.com" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all">
                  <Facebook className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
                <a href="https://twitter.com" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all">
                  <Twitter className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
                <a href="https://linkedin.com" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all">
                  <Linkedin className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
                <a href="https://youtube.com" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all">
                  <Youtube className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#meet-dr-scott" onClick={(e) => { e.preventDefault(); document.getElementById('meet-dr-scott')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-400 hover:text-white transition-colors">Meet Dr. Scott</a></li>
                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/research" className="text-gray-400 hover:text-white transition-colors">Research</Link></li>
                <li><Link href="/professional-development/webinars" className="text-gray-400 hover:text-white transition-colors">Webinars</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support Center</Link></li>
                <li><Link href="/platform-manuals" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:support@edpsychconnect.com" className="hover:text-white transition-colors">support@edpsychconnect.com</a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <a href="tel:08001234567" className="hover:text-white transition-colors">0800 123 4567</a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>London, United Kingdom</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 EdPsych Connect. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
                <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">Accessibility</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
}