'use client';

import dynamic from 'next/dynamic';

import React, { useState } from 'react';



import {
Lightbulb,
  MessageSquare,
  Settings,
  BookOpen,
  Users,
  Layers,
  ChevronDown,
  ChevronUp,
  Brain
} from 'lucide-react';
// Original component

const AIContentRecommendation = dynamic(
  () => import('@/components/ai-learning/AIContentRecommendation')
);

const AIStudyAssistant = dynamic(
  () => import('@/components/ai-learning/AIStudyAssistant')
);

const AILearningStyleAnalyzer = dynamic(
  () => import('@/components/ai-learning/AILearningStyleAnalyzer')
);

function AILearningPage() {
  // In a real application, these would come from authentication and context
  const [userRole, setUserRole] = useState<'student' | 'instructor' | 'admin'>('student');
  const [userId, setUserId] = useState<string>('student-1');
  const [courseId, setCourseId] = useState<string | undefined>('course-1');
  const [expandedSections, setExpandedSections] = useState({
    contentRecommendation: true,
    studyAssistant: true,
    learningStyleAnalyzer: true
  });
  
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold flex items-center mb-4 md:mb-0">
              <Lightbulb className="h-6 w-6 mr-2 text-yellow-400" />
              AI-Enhanced Learning
            </h1>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Role Selector (for demo purposes) */}
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <select
                  className="bg-gray-800 text-white rounded px-3 py-2 text-sm"
                  value={userRole}
                  onChange={(e: any) => setUserRole(e.target.value as any)}
                >
                  <option value="student">Student View</option>
                  <option value="instructor">Instructor View</option>
                  <option value="admin">Admin View</option>
                </select>
              </div>
              
              {/* Course Selector */}
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <select
                  className="bg-gray-800 text-white rounded px-3 py-2 text-sm"
                  value={courseId || ''}
                  onChange={(e: any) => setCourseId(e.target.value || undefined)}
                >
                  <option value="">All Courses</option>
                  <option value="course-1">Introduction to Psychology</option>
                  <option value="course-2">Cognitive Development</option>
                </select>
              </div>
              
              {/* Settings Button */}
              <button
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-2 text-sm"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6">
          {/* Introduction */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Layers className="h-5 w-5 mr-2 text-blue-400" />
              AI-Enhanced Learning Tools
            </h2>
            <p className="text-gray-300 mb-4">
              Welcome to the AI-Enhanced Learning section of the EdPsych AI Platform. 
              These tools use artificial intelligence to personalize your learning experience, 
              provide targeted recommendations, and offer interactive study assistance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium flex items-center mb-2">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-400" />
                  Content Recommendations
                </h3>
                <p className="text-gray-400 text-sm">
                  Receive personalized content recommendations based on your learning goals, 
                  progress, and preferences. Discover new resources that align with your 
                  educational journey.
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium flex items-center mb-2">
                  <MessageSquare className="h-4 w-4 mr-2 text-blue-400" />
                  AI Study Assistant
                </h3>
                <p className="text-gray-400 text-sm">
                  Engage with an interactive AI assistant that can answer questions, 
                  explain concepts, provide practice exercises, and help you review 
                  material effectively.
                </p>
              </div>
            </div>
          </div>
          
          {/* AI Content Recommendation */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div 
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => toggleSection('contentRecommendation')}
            >
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                Personalized Content Recommendations
              </h2>
              {expandedSections.contentRecommendation ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections.contentRecommendation && (
              <AIContentRecommendation
                userId={userId}
                courseId={courseId}
                userRole={userRole}
              />
            )}
          </div>
          
          {/* Learning Style Analyzer */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => toggleSection('learningStyleAnalyzer')}
            >
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-400" />
                Learning Style Analysis
              </h2>
              {expandedSections.learningStyleAnalyzer ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections.learningStyleAnalyzer && (
              <AILearningStyleAnalyzer
                userId={userId}
                courseId={courseId}
                userRole={userRole}
              />
            )}
          </div>
          
          {/* AI Study Assistant */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div 
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => toggleSection('studyAssistant')}
            >
              <h2 className="text-xl font-semibold text-white flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
                AI Study Assistant
              </h2>
              {expandedSections.studyAssistant ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {expandedSections.studyAssistant && (
              <AIStudyAssistant
                userId={userId}
                courseId={courseId}
                userRole={userRole}
              />
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 p-4 mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-gray-400 text-sm">
            <div>
              EdPsych AI Platform &copy; {new Date().getFullYear()} - AI-Enhanced Learning Module
            </div>
            <div className="mt-2 md:mt-0">
              AI models last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AILearningPage;