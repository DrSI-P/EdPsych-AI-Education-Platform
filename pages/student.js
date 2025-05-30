import React from 'react';
import Head from 'next/head';
import MainNavigation from '../src/components/ui/MainNavigation';
import Footer from '../src/components/layout/Footer';
import Link from 'next/link';

const StudentPortal = () => {
  return (
    <>
      <Head>
        <title>Student Portal | EdPsych Connect</title>
        <meta name="description" content="Access your personalized learning path, resources, and track your progress on the EdPsych Connect platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNavigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-gradient animate-fade-in mb-4">
            Welcome to Your Student Portal
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Your personalized hub for educational resources, learning tools, and progress tracking designed to support your unique learning journey.
          </p>
        </section>

        {/* Personalized Learning Path Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-card rounded-lg shadow-md p-6 border border-neutral-200">
            <h2 className="text-2xl font-bold mb-4">Your Personalized Learning Path</h2>
            
            <div className="mb-6">
              <h3 className="text-xl mb-2">Current Progress</h3>
              <div className="progress-bar mb-2">
                <div className="progress-bar-fill" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-neutral-600">65% complete</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-4 interactive-element">
                <h4 className="font-semibold mb-2">Current Module</h4>
                <p className="mb-3">Critical Thinking Skills: Analyzing Information</p>
                <Link href="/learning/critical-thinking" className="btn-primary inline-block">
                  Continue Learning
                </Link>
              </div>
              
              <div className="card p-4 interactive-element">
                <h4 className="font-semibold mb-2">Recommended Next</h4>
                <p className="mb-3">Problem-Solving Strategies: Creative Solutions</p>
                <Link href="/learning/problem-solving" className="btn-outline inline-block">
                  Preview Module
                </Link>
              </div>
            </div>
            
            <div className="mt-6">
              <Link href="/learning/path" className="text-primary font-medium hover:underline">
                View Full Learning Path →
              </Link>
            </div>
          </div>
        </section>

        {/* Learning Resources Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold mb-6">Learning Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Learning Styles */}
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning Styles</h3>
              <p className="text-neutral-700 mb-4">
                Discover your learning style and access tailored resources that match how you learn best.
              </p>
              <Link href="/resources/learning-styles" className="text-primary font-medium hover:underline">
                Explore Resources →
              </Link>
            </div>
            
            {/* Emotional Wellbeing */}
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emotional Wellbeing</h3>
              <p className="text-neutral-700 mb-4">
                Tools and strategies to support your emotional health and build resilience.
              </p>
              <Link href="/resources/emotional-wellbeing" className="text-primary font-medium hover:underline">
                Access Support →
              </Link>
            </div>
            
            {/* Executive Function Support */}
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Executive Function Support</h3>
              <p className="text-neutral-700 mb-4">
                Enhance your planning, organization, and time management skills.
              </p>
              <Link href="/resources/executive-function" className="text-primary font-medium hover:underline">
                Improve Skills →
              </Link>
            </div>
          </div>
        </section>

        {/* Progress Tracking Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="bg-card rounded-lg shadow-md p-6 border border-neutral-200">
            <h2 className="text-2xl font-bold mb-6">Progress Tracking</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl mb-4">Recent Achievements</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="achievement-badge mr-3 mt-1">
                      <div className="achievement-badge-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Critical Analysis Master</h4>
                      <p className="text-sm text-neutral-600">Completed all critical thinking exercises with 90%+ accuracy</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="achievement-badge mr-3 mt-1">
                      <div className="achievement-badge-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Consistent Learner</h4>
                      <p className="text-sm text-neutral-600">Logged in for 5 consecutive days</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="achievement-badge mr-3 mt-1">
                      <div className="achievement-badge-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Feedback Champion</h4>
                      <p className="text-sm text-neutral-600">Provided thoughtful feedback on 3 learning modules</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl mb-4">Skills Development</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Critical Thinking</span>
                      <span className="text-sm text-neutral-600">85%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Problem Solving</span>
                      <span className="text-sm text-neutral-600">70%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Communication</span>
                      <span className="text-sm text-neutral-600">60%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Research Skills</span>
                      <span className="text-sm text-neutral-600">75%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link href="/progress/detailed" className="btn-secondary inline-block">
                    View Detailed Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default StudentPortal;
