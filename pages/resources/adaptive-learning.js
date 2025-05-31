import React from 'react';
import Head from 'next/head';
import MainNavigation from '../../src/components/ui/MainNavigation';
import Footer from '../../src/components/layout/Footer';
import Link from 'next/link';

const AdaptiveLearning = () => {
  return (
    <>
      <Head>
        <title>Adaptive Learning Strategies | EdPsych Connect</title>
        <meta name="description" content="Explore adaptive learning strategies that personalize education to meet individual student needs and learning styles." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNavigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-gradient animate-fade-in mb-4 text-center">
            Adaptive Learning Strategies
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Personalized approaches that adapt to individual learning styles and needs to maximize engagement and outcomes.
          </p>
        </section>

        {/* Introduction Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-card rounded-lg shadow-md p-8 border border-neutral-200">
            <h2 className="text-2xl font-bold mb-4">What is Adaptive Learning?</h2>
            <p className="mb-4">
              Adaptive learning is an educational method that uses technology and data to adjust the learning path and pace to meet the unique needs of each student. It provides personalized learning experiences that respond to individual strengths, weaknesses, and learning preferences.
            </p>
            <p className="mb-4">
              Unlike traditional one-size-fits-all approaches, adaptive learning systems continuously assess student performance and adjust content delivery in real-time, ensuring that each learner receives the right level of challenge and support.
            </p>
            <p>
              Research shows that adaptive learning can significantly improve student outcomes by addressing individual learning gaps, increasing engagement, and fostering self-directed learning skills.
            </p>
          </div>
        </section>

        {/* Key Components Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold mb-6">Key Components</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Assessment */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Assessment</h3>
              <p className="text-neutral-700">
                Regular evaluation of student understanding and performance through formative assessments, quizzes, and learning activities to identify strengths and areas for improvement.
              </p>
            </div>
            
            {/* Personalization */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Content</h3>
              <p className="text-neutral-700">
                Tailored learning materials and activities that match individual learning styles, preferences, and current level of understanding to optimize engagement and comprehension.
              </p>
            </div>
            
            {/* Feedback */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Immediate Feedback</h3>
              <p className="text-neutral-700">
                Timely, specific feedback that helps students understand their progress, correct misconceptions, and adjust their learning strategies for better outcomes.
              </p>
            </div>
            
            {/* Flexible Pacing */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Pacing</h3>
              <p className="text-neutral-700">
                Learning sequences that adjust to each student's pace, allowing them to spend more time on challenging concepts and move quickly through material they've mastered.
              </p>
            </div>
            
            {/* Data Analytics */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
              <p className="text-neutral-700">
                Comprehensive analytics that provide educators with actionable insights into student performance, learning patterns, and areas requiring intervention.
              </p>
            </div>
            
            {/* Multimodal Resources */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multimodal Resources</h3>
              <p className="text-neutral-700">
                Diverse content formats including text, video, audio, interactive simulations, and hands-on activities to accommodate different learning preferences and styles.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-2xl font-bold mb-6">Benefits for Students</h2>
          
          <div className="bg-card rounded-lg shadow-md p-8 border border-neutral-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Personalized Learning Experience</h4>
                      <p className="text-sm text-neutral-600">Content and activities tailored to individual needs, interests, and learning styles</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Increased Engagement</h4>
                      <p className="text-sm text-neutral-600">Higher motivation and participation through relevant, appropriately challenging content</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Targeted Support</h4>
                      <p className="text-sm text-neutral-600">Immediate intervention and additional resources for areas of difficulty</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Reduced Learning Gaps</h4>
                      <p className="text-sm text-neutral-600">Systematic coverage of curriculum with fewer knowledge gaps</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Self-Directed Learning Skills</h4>
                      <p className="text-sm text-neutral-600">Development of autonomy, metacognition, and ownership of learning</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Improved Outcomes</h4>
                      <p className="text-sm text-neutral-600">Better academic achievement and deeper understanding of concepts</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Toolkit Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-2xl font-bold mb-6">Implementation Toolkit</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Learning Style Assessment */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Learning Style Assessment</h3>
              <p className="mb-4">
                Tools to identify individual learning preferences and adapt teaching approaches accordingly.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>VARK (Visual, Auditory, Reading/Writing, Kinesthetic) questionnaires</li>
                <li>Multiple intelligences assessment tools</li>
                <li>Learning preferences observation checklists</li>
                <li>Student self-reflection templates</li>
              </ul>
              <Link href="/resources/tools/learning-style-assessment" className="btn-outline inline-block">
                Access Assessment Tools
              </Link>
            </div>
            
            {/* Multi-Modal Resources */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Multi-Modal Resources</h3>
              <p className="mb-4">
                Content presented in various formats to accommodate different learning preferences.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Visual learning materials (infographics, diagrams, videos)</li>
                <li>Auditory resources (podcasts, audiobooks, discussions)</li>
                <li>Reading/writing activities (texts, worksheets, journals)</li>
                <li>Kinesthetic experiences (manipulatives, experiments, role-play)</li>
              </ul>
              <Link href="/resources/tools/multi-modal-resources" className="btn-outline inline-block">
                Explore Resource Library
              </Link>
            </div>
            
            {/* Progress Monitoring */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Progress Monitoring Tools</h3>
              <p className="mb-4">
                Systems to track student progress and adjust learning paths based on performance data.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Formative assessment templates</li>
                <li>Digital learning analytics dashboards</li>
                <li>Progress tracking charts and visual displays</li>
                <li>Goal-setting and reflection frameworks</li>
              </ul>
              <Link href="/resources/tools/progress-monitoring" className="btn-outline inline-block">
                Access Monitoring Tools
              </Link>
            </div>
            
            {/* Differentiation Strategies */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Differentiation Strategies</h3>
              <p className="mb-4">
                Approaches to modify content, process, and products based on student readiness, interest, and learning profile.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Tiered assignment templates</li>
                <li>Flexible grouping strategies</li>
                <li>Choice boards and learning menus</li>
                <li>Scaffolding techniques for various ability levels</li>
              </ul>
              <Link href="/resources/tools/differentiation-strategies" className="btn-outline inline-block">
                View Strategy Guide
              </Link>
            </div>
          </div>
        </section>

        {/* Research and Evidence Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-2xl font-bold mb-6">Research & Evidence</h2>
          
          <div className="bg-card rounded-lg shadow-md p-8 border border-neutral-200">
            <p className="mb-6">
              Adaptive learning approaches are supported by a growing body of research demonstrating their effectiveness in improving student outcomes across diverse educational settings.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Research Findings</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <div>
                      <p className="text-neutral-600">Students using adaptive learning systems show 20-30% improvement in learning outcomes compared to traditional instruction (Education Endowment Foundation, 2023)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <div>
                      <p className="text-neutral-600">Adaptive approaches are particularly effective for students with special educational needs, reducing achievement gaps by up to 40% (UK Department for Education, 2024)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <div>
                      <p className="text-neutral-600">Student engagement increases by 35% when learning is personalized to individual interests and preferences (Journal of Educational Psychology, 2023)</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Case Studies</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Oakwood Primary School</h4>
                      <p className="text-sm text-neutral-600">Implemented adaptive learning across KS2, resulting in 27% improvement in maths attainment</p>
                      <Link href="/resources/case-studies/oakwood" className="text-primary text-sm hover:underline">
                        Read Case Study →
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Westfield Secondary Academy</h4>
                      <p className="text-sm text-neutral-600">Reduced achievement gap for disadvantaged students by 32% using adaptive approaches</p>
                      <Link href="/resources/case-studies/westfield" className="text-primary text-sm hover:underline">
                        Read Case Study →
                      </Link>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6">
                  <Link href="/resources/research/adaptive-learning" className="btn-primary inline-block">
                    View Full Research Library
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

export default AdaptiveLearning;
