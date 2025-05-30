import React from 'react';
import Head from 'next/head';
import MainNavigation from '../../src/components/ui/MainNavigation';
import Footer from '../../src/components/layout/Footer';

const AdaptiveLearning = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head>
        <title>Adaptive Learning Strategies | EdPsych Connect</title>
        <meta name="description" content="Personalized approaches that adapt to individual learning styles and needs." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <MainNavigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Adaptive Learning Strategies</h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300">
            Personalized approaches that adapt to individual learning styles and needs
          </p>
        </header>
        
        <main>
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">What is Adaptive Learning?</h2>
            <p className="mb-6 text-lg">
              Adaptive learning is an educational method that uses technology and data to adjust the learning 
              path and pace to meet the unique needs of each student. It provides personalized learning 
              experiences that respond to individual strengths, weaknesses, and learning preferences.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Key Components</h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                  <li>Continuous assessment of student performance</li>
                  <li>Personalized content delivery based on individual needs</li>
                  <li>Immediate feedback and support</li>
                  <li>Flexible pacing that adjusts to student progress</li>
                  <li>Data-driven insights for educators</li>
                </ul>
              </div>
              
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Benefits for Students</h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                  <li>Personalized learning experiences</li>
                  <li>Increased engagement and motivation</li>
                  <li>Targeted support for areas of difficulty</li>
                  <li>Reduced learning gaps</li>
                  <li>Development of self-directed learning skills</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Adaptive Learning Toolkit</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Learning Style Assessment</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Tools to identify individual learning preferences and adapt teaching approaches accordingly.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Access Assessment
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Multi-Modal Resources</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Content presented in various formats to accommodate different learning preferences.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Explore Resources
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Progress Monitoring</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Tools to track student progress and adjust learning paths based on performance data.
                </p>
                <div className="text-primary font-medium flex items-center">
                  View Tools
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Implementation Resources</h2>
            
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">Implementation Guide</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Step-by-step guidance for implementing adaptive learning strategies in your classroom.
                  </p>
                  <button className="btn-primary">Download Guide</button>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Research & Evidence</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Access the latest research on adaptive learning and its impact on student outcomes.
                  </p>
                  <button className="btn-primary">View Research</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdaptiveLearning;
