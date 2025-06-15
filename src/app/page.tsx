'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  Calendar, Gift, User, Volume2, Eye, Accessibility,
  MousePointer, Keyboard, Mic, Speaker
} from 'lucide-react';

// Hero Section Component
const HeroSection = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const heroFeatures = [
    "120+ Professional Features",
    "24/7 AI Avatar Support", 
    "Evidence-Based Strategies",
    "Global Accessibility"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % heroFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image 
              src="/logo-horizontal.png" 
              alt="EdPsych Connect" 
              width={200} 
              height={60}
              className="h-12 w-auto"
            />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-white hover:text-green-300 transition-colors font-medium">Features</Link>
            <Link href="#pricing" className="text-white hover:text-green-300 transition-colors font-medium">Pricing</Link>
            <Link href="#about" className="text-white hover:text-green-300 transition-colors font-medium">About</Link>
            <Link href="/auth/signin" className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-40 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2 text-green-300" />
              <span className="text-sm font-medium">Transforming Educational Psychology</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              The Future of
              <span className="block bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                Educational Psychology
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
              Empowering 1.7 million children with AI-powered, evidence-based support. 
              The world's first comprehensive educational psychology platform.
            </p>

            {/* Dynamic Feature Display */}
            <div className="mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center text-green-300 text-lg font-semibold"
                >
                  <CheckCircle2 className="w-6 h-6 mr-3" />
                  {heroFeatures[currentFeature]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/20"
              >
                <Play className="w-5 h-5 mr-2 inline" />
                Watch Demo
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">1.7M+</div>
                <div className="text-sm text-blue-200">Children Supported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">120+</div>
                <div className="text-sm text-blue-200">Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">24/7</div>
                <div className="text-sm text-blue-200">AI Support</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Platform Preview */}
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-white/60 text-sm">EdPsych Connect Platform</div>
              </div>

              {/* Mock Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                  <Brain className="w-8 h-8 text-green-300" />
                  <div>
                    <div className="text-white font-semibold">AI Assessment Complete</div>
                    <div className="text-white/60 text-sm">Personalized learning path generated</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-blue-300" />
                  <div>
                    <div className="text-white font-semibold">Dr. Scott Available</div>
                    <div className="text-white/60 text-sm">Ask me anything about educational psychology</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-purple-300" />
                  <div>
                    <div className="text-white font-semibold">Progress Tracking</div>
                    <div className="text-white/60 text-sm">Real-time analytics and insights</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-green-400 text-white p-3 rounded-full shadow-lg"
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
};

// Features Overview Component
const FeaturesOverview = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Assessments",
      description: "Comprehensive evaluation tools powered by advanced AI to identify learning needs and create personalized pathways.",
      color: "from-purple-500 to-indigo-600",
      features: ["Cognitive assessments", "Behavioral analysis", "Learning style identification", "Progress tracking"]
    },
    {
      icon: MessageSquare,
      title: "24/7 Dr. Scott AI Avatar",
      description: "Professional guidance available around the clock with decades of educational psychology expertise.",
      color: "from-green-500 to-emerald-600", 
      features: ["Expert consultations", "Instant responses", "Personalized advice", "Evidence-based strategies"]
    },
    {
      icon: Users,
      title: "Multi-User Ecosystem",
      description: "Seamless collaboration between students, educators, parents, and professionals in one unified platform.",
      color: "from-blue-500 to-cyan-600",
      features: ["Student portals", "Teacher dashboards", "Parent insights", "Professional tools"]
    },
    {
      icon: Accessibility,
      title: "Universal Accessibility",
      description: "Comprehensive accessibility features ensuring every learner can access and benefit from our platform.",
      color: "from-orange-500 to-red-600",
      features: ["Screen reader support", "Voice navigation", "High contrast modes", "Keyboard accessibility"]
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Educational Psychology Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to support, assess, and empower learners in one sophisticated platform.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Dr. Scott Section Component
const DrScottSection = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 mr-2 text-yellow-300" />
              <span className="text-sm font-medium">20+ Years Experience</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Meet Dr. Scott I-Patrick
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Educational Psychologist with over two decades of experience supporting children, 
              families, and educational professionals. Now available 24/7 through our advanced AI avatar system.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <GraduationCap className="w-6 h-6 text-green-300 mr-3" />
                <span>Doctorate in Educational Psychology</span>
              </div>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-green-300 mr-3" />
                <span>Thousands of families supported</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-green-300 mr-3" />
                <span>Evidence-based practice specialist</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-green-300 mr-3" />
                <span>Advocate for inclusive education</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              Ask Dr. Scott
              <MessageSquare className="w-5 h-5 ml-2 inline" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Avatar Preview */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Dr. Scott I-Patrick</h3>
                <p className="text-blue-200 mb-6">Educational Psychologist</p>
                
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <p className="text-white italic">
                    "Every child deserves personalized support to reach their full potential. 
                    I'm here to help make that happen, 24/7."
                  </p>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">20+</div>
                    <div className="text-sm text-blue-200">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">24/7</div>
                    <div className="text-sm text-blue-200">Available</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection = () => {
  const pricingPlans = [
    {
      name: "Student",
      price: "£29.99",
      period: "/month",
      description: "Perfect for individual learners",
      features: [
        "Full access to learning tools",
        "Progress tracking & analytics",
        "10 AI avatar consultations/month",
        "Personalized learning paths",
        "Mobile app access",
        "Email support"
      ],
      color: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Parent",
      price: "£49.99", 
      period: "/month",
      description: "Comprehensive family support",
      features: [
        "Family dashboard access",
        "Home support tools & strategies",
        "25 AI avatar consultations/month",
        "School collaboration features",
        "Parent training modules",
        "Priority support"
      ],
      color: "from-green-500 to-emerald-500",
      popular: true
    },
    {
      name: "Educator",
      price: "£79.99",
      period: "/month", 
      description: "Professional development tools",
      features: [
        "Classroom management features",
        "Professional development modules",
        "Unlimited AI avatar access",
        "Resource creation tools",
        "Student progress insights",
        "Expert consultation"
      ],
      color: "from-purple-500 to-indigo-500",
      popular: false
    },
    {
      name: "Professional",
      price: "£149.99",
      period: "/month",
      description: "Advanced assessment & analytics",
      features: [
        "Advanced assessment tools",
        "Case management system", 
        "Research & analytics tools",
        "Unlimited platform access",
        "Custom report generation",
        "Direct consultation booking"
      ],
      color: "from-orange-500 to-red-500",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Premium Pricing for Premium Value
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our comprehensive 
            educational psychology platform with 24/7 AI support.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                plan.popular ? 'border-green-500 scale-105' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center mb-6`}>
                  <Star className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-green-500 hover:bg-green-400 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Enterprise Solutions</h3>
            <p className="text-xl text-blue-100 mb-6">
              Custom solutions for schools, districts, and large organizations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
              >
                Contact Sales
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image 
              src="/logo-horizontal.png" 
              alt="EdPsych Connect" 
              width={200} 
              height={60}
              className="h-12 w-auto mb-6"
            />
            <p className="text-gray-400 mb-6">
              Transforming educational psychology through innovative AI-powered solutions 
              and evidence-based practices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all">
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all">
                <Youtube className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/research" className="text-gray-400 hover:text-white transition-colors">Research</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              <li><Link href="/documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@edpsychconnect.com" className="hover:text-white transition-colors">
                  support@edpsychconnect.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <a href="tel:08001234567" className="hover:text-white transition-colors">
                  0800 123 4567
                </a>
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
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesOverview />
      <DrScottSection />
      <PricingSection />
      <Footer />
    </div>
  );
}

