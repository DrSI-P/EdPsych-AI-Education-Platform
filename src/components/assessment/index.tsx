'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ClipboardCheck, ArrowLeft, BarChart3, Users, Brain } from 'lucide-react';

export function Assessment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-indigo-900/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Assessment Tools</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional-grade assessment tools for accurate evaluation and progress tracking
          </p>
        </div>

        {/* Assessment Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all">
            <Brain className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Cognitive Assessments</h3>
            <p className="text-gray-300 mb-6">
              Comprehensive cognitive ability tests, memory assessments, and processing speed evaluations.
            </p>
            <Link href="/dashboard" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Start Assessment →
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all">
            <ClipboardCheck className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Behavioral Checklists</h3>
            <p className="text-gray-300 mb-6">
              Evidence-based behavioral assessment tools for ADHD, autism, and other conditions.
            </p>
            <Link href="/dashboard" className="text-yellow-400 hover:text-yellow-300 font-medium">
              View Checklists →
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all">
            <BarChart3 className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Progress Tracking</h3>
            <p className="text-gray-300 mb-6">
              Monitor student progress over time with detailed analytics and reporting tools.
            </p>
            <Link href="/dashboard" className="text-yellow-400 hover:text-yellow-300 font-medium">
              View Progress →
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Assessment Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Available Assessments</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Cognitive Ability Tests</li>
                <li>• ADHD Rating Scales</li>
                <li>• Autism Spectrum Questionnaires</li>
                <li>• Dyslexia Screening Tools</li>
                <li>• Emotional Wellbeing Scales</li>
                <li>• Executive Function Tests</li>
                <li>• Social Skills Evaluations</li>
                <li>• Academic Achievement Tracking</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Key Benefits</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Evidence-based instruments</li>
                <li>• Automated scoring and analysis</li>
                <li>• Detailed reports generation</li>
                <li>• Progress tracking over time</li>
                <li>• Comparison with normative data</li>
                <li>• Export to PDF/CSV formats</li>
                <li>• Secure data storage</li>
                <li>• GDPR compliant</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 font-bold rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105"
            >
              Get Started with Assessments
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}