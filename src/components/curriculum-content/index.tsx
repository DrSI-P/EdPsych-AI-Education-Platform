'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowLeft, FileText, Target, Users } from 'lucide-react';

export function CurriculumContent() {
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Curriculum Content</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive educational resources aligned with national curriculum standards
          </p>
        </div>

        {/* Content Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all">
            <FileText className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Lesson Plans</h3>
            <p className="text-gray-300 mb-6">
              Ready-to-use lesson plans with differentiation strategies for all learners.
            </p>
            <Link href="/dashboard" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Browse Lessons →
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all">
            <Target className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Learning Objectives</h3>
            <p className="text-gray-300 mb-6">
              Clear objectives mapped to curriculum standards and assessment criteria.
            </p>
            <Link href="/dashboard" className="text-yellow-400 hover:text-yellow-300 font-medium">
              View Objectives →
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:scale-105 transition-all">
            <GraduationCap className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Resources</h3>
            <p className="text-gray-300 mb-6">
              Worksheets, activities, and multimedia resources for engaging lessons.
            </p>
            <Link href="/dashboard" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Access Resources →
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Curriculum Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Subject Coverage</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• English Language & Literature</li>
                <li>• Mathematics</li>
                <li>• Science (Biology, Chemistry, Physics)</li>
                <li>• History & Geography</li>
                <li>• Modern Foreign Languages</li>
                <li>• PSHE & Citizenship</li>
                <li>• Computing & ICT</li>
                <li>• Arts & Creative Subjects</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• National Curriculum aligned</li>
                <li>• SEN differentiation built-in</li>
                <li>• Interactive activities</li>
                <li>• Assessment materials included</li>
                <li>• Cross-curricular links</li>
                <li>• Homework suggestions</li>
                <li>• Parent engagement resources</li>
                <li>• Progress tracking tools</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 font-bold rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105"
            >
              Access Full Curriculum
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}