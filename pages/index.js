import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import MainNavigation from '../src/components/ui/MainNavigation';
import Footer from '../src/components/layout/Footer';
import dynamic from 'next/dynamic';

// Import AI Avatar component with SSR disabled
const AIAvatarWrapper = dynamic(
  () => import('../src/components/ai-avatar/ai-avatar-wrapper'),
  { ssr: false }
);

/**
 * Enhanced homepage for EdPsych Connect using Pages Router approach
 * With full navigation, footer, and enhanced styling
 */
export default function Home() {
  const { theme, setTheme } = useTheme();
  const [ageGroup, setAgeGroup] = useState('standard');
  const [mounted, setMounted] = useState(false);
  
  // Use useEffect to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Enhanced age group handler that uses next-themes
  const handleAgeGroupChange = (value) => {
    setAgeGroup(value);
    setTheme(value + '-theme');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head>
        <title>EdPsych Connect - Educational Psychology Platform</title>
        <meta name="description" content="EdPsych Connect - Empowering learners through tailored, evidence-based support" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
      </Head>
      
      <MainNavigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* AI Avatar Navigation Assistant */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 animate-fade-in">
          <AIAvatarWrapper />
        </div>
        
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">EdPsych Connect</h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300">
            Empowering learners through tailored, evidence-based support
          </p>
        </header>
        
        <main>
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Welcome to EdPsych Connect</h2>
            <p className="mb-6 text-lg">
              EdPsych Connect is a comprehensive platform designed by educational psychologists 
              to provide personalised learning experiences for all students.
            </p>
            
            <div className="mt-8">
              <h3 className="text-xl mb-4">Select Age Group:</h3>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleAgeGroupChange('nursery')}
                  className={`px-5 py-2.5 rounded-full transition-all duration-300 ${ageGroup === 'nursery' ? 'btn-nursery' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                >
                  Nursery
                </button>
                <button 
                  onClick={() => handleAgeGroupChange('early-primary')}
                  className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${ageGroup === 'early-primary' ? 'btn-early-primary' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                >
                  Early Primary
                </button>
                <button 
                  onClick={() => handleAgeGroupChange('late-primary')}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 ${ageGroup === 'late-primary' ? 'late-primary-ui text-white' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                >
                  Late Primary
                </button>
                <button 
                  onClick={() => handleAgeGroupChange('secondary')}
                  className={`px-5 py-2.5 rounded-md transition-all duration-300 ${ageGroup === 'secondary' ? 'secondary-ui text-white' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                >
                  Secondary
                </button>
                <button 
                  onClick={() => handleAgeGroupChange('standard')}
                  className={`px-5 py-2.5 rounded-md transition-all duration-300 ${ageGroup === 'standard' ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                >
                  Standard
                </button>
              </div>
            </div>
          </section>
          
          <section className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">For Students</h2>
              <p className="mb-6 text-lg">
                Personalised learning paths, interactive content, and tools designed to support your unique learning style.
              </p>
              <Link href="/student" className="btn-primary inline-flex items-center justify-center">
                Student Portal
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="p-8 bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">For Educators</h2>
              <p className="mb-6 text-lg">
                Evidence-based resources, assessment tools, and professional development to enhance your teaching practice.
              </p>
              <Link href="/educator" className="btn-primary inline-flex items-center justify-center">
                Educator Resources
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </section>
          
          <section className="p-8 bg-card rounded-lg shadow-md mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Featured Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/resources/restorative-justice" className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 interactive-element bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-medium mb-3">Restorative Justice Practices</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4 flex-grow">
                    Evidence-based approaches to building community and resolving conflict in educational settings.
                  </p>
                  <div className="text-primary font-medium flex items-center mt-auto">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
              
              <Link href="/resources/adaptive-learning" className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 interactive-element bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-medium mb-3">Adaptive Learning Strategies</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4 flex-grow">
                    Personalized approaches that adapt to individual learning styles and needs.
                  </p>
                  <div className="text-primary font-medium flex items-center mt-auto">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
              
              <Link href="/resources/special-needs" className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 interactive-element bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-medium mb-3">Special Educational Needs Support</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4 flex-grow">
                    Resources and tools to support diverse learning needs and abilities.
                  </p>
                  <div className="text-primary font-medium flex items-center mt-auto">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
