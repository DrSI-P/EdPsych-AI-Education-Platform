import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from 'next-themes';

/**
 * Main homepage for EdPsych Connect using Pages Router approach
 * Simplified version without direct DOM manipulation
 */
export default function Home() {
  const { setTheme } = useTheme();
  const [ageGroup, setAgeGroup] = useState('standard');
  
  // Simplified age group handler that uses next-themes instead of direct DOM manipulation
  const handleAgeGroupChange = (value) => {
    setAgeGroup(value);
    setTheme(value + '-theme');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>EdPsych Connect - Educational Psychology Platform</title>
        <meta name="description" content="EdPsych Connect - Empowering learners through tailored, evidence-based support" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-primary mb-2">EdPsych Connect</h1>
        <p className="text-xl text-neutral-600">Empowering learners through tailored, evidence-based support</p>
      </header>
      
      <main>
        <section className="mb-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome to EdPsych Connect</h2>
          <p className="mb-4">
            EdPsych Connect is a comprehensive platform designed by educational psychologists 
            to provide personalised learning experiences for all students.
          </p>
          
          <div className="mt-6">
            <h3 className="text-xl mb-2">Select Age Group:</h3>
            <div className="flex flex-wrap gap-3">
              {/* Simplified buttons without asChild prop */}
              <button 
                onClick={() => handleAgeGroupChange('nursery')}
                className={`px-4 py-2 rounded-full ${ageGroup === 'nursery' ? 'bg-primary text-white' : 'bg-neutral-100'}`}
              >
                Nursery
              </button>
              <button 
                onClick={() => handleAgeGroupChange('early-primary')}
                className={`px-4 py-2 rounded-lg ${ageGroup === 'early-primary' ? 'bg-primary text-white' : 'bg-neutral-100'}`}
              >
                Early Primary
              </button>
              <button 
                onClick={() => handleAgeGroupChange('late-primary')}
                className={`px-4 py-2 rounded-md ${ageGroup === 'late-primary' ? 'bg-primary text-white' : 'bg-neutral-100'}`}
              >
                Late Primary
              </button>
              <button 
                onClick={() => handleAgeGroupChange('secondary')}
                className={`px-4 py-2 rounded-md ${ageGroup === 'secondary' ? 'bg-primary text-white' : 'bg-neutral-100'}`}
              >
                Secondary
              </button>
              <button 
                onClick={() => handleAgeGroupChange('standard')}
                className={`px-4 py-2 rounded-md ${ageGroup === 'standard' ? 'bg-primary text-white' : 'bg-neutral-100'}`}
              >
                Standard
              </button>
            </div>
          </div>
        </section>
        
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">For Students</h2>
            <p className="mb-4">
              Personalised learning paths, interactive content, and tools designed to support your unique learning style.
            </p>
            {/* Regular Link component without asChild prop */}
            <Link href="/student" className="inline-block px-4 py-2 bg-primary text-white rounded-md">
              Student Portal
            </Link>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">For Educators</h2>
            <p className="mb-4">
              Evidence-based resources, assessment tools, and professional development to enhance your teaching practice.
            </p>
            {/* Regular Link component without asChild prop */}
            <Link href="/educator" className="inline-block px-4 py-2 bg-primary text-white rounded-md">
              Educator Resources
            </Link>
          </div>
        </section>
        
        <section className="p-6 bg-white rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-semibold mb-4">Featured Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Regular Link components without asChild prop */}
            <Link href="/resources/restorative-justice" className="p-4 border rounded-md hover:bg-neutral-50">
              Restorative Justice Practices
            </Link>
            <Link href="/resources/adaptive-learning" className="p-4 border rounded-md hover:bg-neutral-50">
              Adaptive Learning Strategies
            </Link>
            <Link href="/resources/special-needs" className="p-4 border rounded-md hover:bg-neutral-50">
              Special Educational Needs Support
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="mt-12 pt-6 border-t border-neutral-200">
        <p className="text-center text-neutral-500">
          &copy; {new Date().getFullYear()} EdPsych Connect. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
