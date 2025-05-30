import React from 'react';
import Head from 'next/head';
import MainNavigation from '../src/components/ui/MainNavigation';
import Footer from '../src/components/layout/Footer';
import Link from 'next/link';

const EducatorResources = () => {
  return (
    <>
      <Head>
        <title>Educator Resources | EdPsych Connect</title>
        <meta name="description" content="Access teaching resources, assessment tools, and professional development materials designed for educators on the EdPsych Connect platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNavigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-gradient animate-fade-in mb-4">
            Educator Resources
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Evidence-based teaching resources, assessment tools, and professional development materials to support your educational practice.
          </p>
        </section>

        {/* Teaching Resources Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold mb-6">Teaching Resources</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lesson Plans</h3>
              <p className="text-neutral-700 mb-4">
                Access evidence-based lesson plans aligned with UK curriculum standards across all key stages.
              </p>
              <Link href="/resources/lesson-plans" className="text-primary font-medium hover:underline">
                Browse Lesson Plans →
              </Link>
            </div>
            
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Worksheets & Activities</h3>
              <p className="text-neutral-700 mb-4">
                Printable and digital worksheets, activities, and exercises to engage students of all learning styles.
              </p>
              <Link href="/resources/worksheets" className="text-primary font-medium hover:underline">
                Download Resources →
              </Link>
            </div>
            
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discussion Guides</h3>
              <p className="text-neutral-700 mb-4">
                Structured discussion prompts and facilitation guides to promote critical thinking and dialogue.
              </p>
              <Link href="/resources/discussions" className="text-primary font-medium hover:underline">
                Explore Guides →
              </Link>
            </div>
          </div>
        </section>

        {/* Assessment Tools Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold mb-6">Assessment Tools</h2>
          
          <div className="bg-card rounded-lg shadow-md p-6 border border-neutral-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Formative Assessment</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Quick Checks</h4>
                      <p className="text-sm text-neutral-600">Brief assessments to gauge understanding during lessons</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Exit Tickets</h4>
                      <p className="text-sm text-neutral-600">End-of-lesson assessments to measure learning outcomes</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Peer Assessment Tools</h4>
                      <p className="text-sm text-neutral-600">Structured frameworks for student-to-student feedback</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link href="/assessment/formative" className="btn-outline inline-block mt-2">
                    Access Formative Tools
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Summative Assessment</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Unit Tests</h4>
                      <p className="text-sm text-neutral-600">Comprehensive assessments aligned with curriculum objectives</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Project Rubrics</h4>
                      <p className="text-sm text-neutral-600">Detailed evaluation criteria for project-based assessments</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Progress Reports</h4>
                      <p className="text-sm text-neutral-600">Templates for documenting and communicating student progress</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link href="/assessment/summative" className="btn-outline inline-block mt-2">
                    Access Summative Tools
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Development Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-2xl font-bold mb-6">Professional Development</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Upcoming Webinars</h3>
              <ul className="space-y-4">
                <li>
                  <p className="font-medium">Supporting Neurodiversity in the Classroom</p>
                  <p className="text-sm text-neutral-600">June 15, 2025 • 16:00-17:30 BST</p>
                  <Link href="/pd/webinars/neurodiversity" className="text-primary text-sm hover:underline">
                    Register →
                  </Link>
                </li>
                <li>
                  <p className="font-medium">Effective Feedback Strategies</p>
                  <p className="text-sm text-neutral-600">June 22, 2025 • 16:00-17:30 BST</p>
                  <Link href="/pd/webinars/feedback" className="text-primary text-sm hover:underline">
                    Register →
                  </Link>
                </li>
                <li>
                  <p className="font-medium">Trauma-Informed Teaching Practices</p>
                  <p className="text-sm text-neutral-600">July 6, 2025 • 16:00-17:30 BST</p>
                  <Link href="/pd/webinars/trauma-informed" className="text-primary text-sm hover:underline">
                    Register →
                  </Link>
                </li>
              </ul>
              <Link href="/pd/webinars" className="btn-secondary inline-block mt-4">
                View All Webinars
              </Link>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Self-Paced Courses</h3>
              <ul className="space-y-4">
                <li>
                  <p className="font-medium">Differentiated Instruction Fundamentals</p>
                  <p className="text-sm text-neutral-600">5 modules • 10 CPD hours</p>
                  <Link href="/pd/courses/differentiation" className="text-primary text-sm hover:underline">
                    Enroll →
                  </Link>
                </li>
                <li>
                  <p className="font-medium">Assessment for Learning</p>
                  <p className="text-sm text-neutral-600">4 modules • 8 CPD hours</p>
                  <Link href="/pd/courses/assessment" className="text-primary text-sm hover:underline">
                    Enroll →
                  </Link>
                </li>
                <li>
                  <p className="font-medium">Building Inclusive Classrooms</p>
                  <p className="text-sm text-neutral-600">6 modules • 12 CPD hours</p>
                  <Link href="/pd/courses/inclusion" className="text-primary text-sm hover:underline">
                    Enroll →
                  </Link>
                </li>
              </ul>
              <Link href="/pd/courses" className="btn-secondary inline-block mt-4">
                Browse All Courses
              </Link>
            </div>
          </div>
        </section>

        {/* Educational Psychology Resources Grid */}
        <section className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-2xl font-bold mb-6">Educational Psychology Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Restorative Justice */}
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Restorative Justice</h3>
              <p className="text-neutral-700 mb-4">
                Evidence-based approaches to building community, repairing harm, and fostering positive relationships in educational settings.
              </p>
              <Link href="/resources/restorative-justice" className="btn-primary inline-block">
                Explore Resources
              </Link>
            </div>
            
            {/* Special Needs Support */}
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Special Needs Support</h3>
              <p className="text-neutral-700 mb-4">
                Comprehensive resources for supporting diverse learning needs, including assessment tools and intervention strategies.
              </p>
              <Link href="/resources/special-needs" className="btn-primary inline-block">
                Access Support Tools
              </Link>
            </div>
            
            {/* Learning Styles */}
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning Styles</h3>
              <p className="text-neutral-700 mb-4">
                Research-based approaches to identifying and accommodating different learning styles in your teaching practice.
              </p>
              <Link href="/resources/learning-styles" className="btn-primary inline-block">
                Discover Strategies
              </Link>
            </div>
            
            {/* Adaptive Learning */}
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Adaptive Learning</h3>
              <p className="text-neutral-700 mb-4">
                Tools and strategies for implementing adaptive learning approaches that respond to individual student needs.
              </p>
              <Link href="/resources/adaptive-learning" className="btn-primary inline-block">
                Explore Approaches
              </Link>
            </div>
            
            {/* Behavior Management */}
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Behavior Management</h3>
              <p className="text-neutral-700 mb-4">
                Positive behavior support strategies and interventions based on educational psychology principles.
              </p>
              <Link href="/resources/behavior-management" className="btn-primary inline-block">
                Access Strategies
              </Link>
            </div>
            
            {/* Assessment & Evaluation */}
            <div className="card p-6 interactive-element">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Assessment & Evaluation</h3>
              <p className="text-neutral-700 mb-4">
                Comprehensive assessment frameworks and evaluation tools based on educational psychology research.
              </p>
              <Link href="/resources/assessment-evaluation" className="btn-primary inline-block">
                View Frameworks
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default EducatorResources;
