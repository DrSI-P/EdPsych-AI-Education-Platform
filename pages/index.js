import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MainNavigation from '../src/components/ui/MainNavigation';
import Footer from '../src/components/layout/Footer';
import { VoiceInputProvider } from '../src/components/VoiceInput';

export default function Home() {
  return (
    <VoiceInputProvider>
      <div className="min-h-screen flex flex-col">
        <Head>
          <title>EdPsych Connect - Personalised Learning for All Students</title>
          <meta name="description" content="EdPsych Connect is a comprehensive platform designed by educational psychologists to provide personalised learning experiences for all students." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MainNavigation />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-white to-gray-100 py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                  Welcome to EdPsych Connect
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  EdPsych Connect is a comprehensive platform designed by educational psychologists to provide personalised learning experiences for all students.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/student" className="btn-primary animate-fade-in" style={{animationDelay: '0.1s'}}>
                    Student Portal
                  </Link>
                  <Link href="/educator" className="btn-secondary animate-fade-in" style={{animationDelay: '0.2s'}}>
                    Educator Resources
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Age Group Selection */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-semibold mb-8 text-center">Select Age Group:</h2>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link href="/age-group/nursery" className="age-group-button bg-gray-800 text-white hover:bg-gray-700 animate-fade-in" style={{animationDelay: '0.3s'}}>
                  Nursery
                </Link>
                <Link href="/age-group/early-primary" className="age-group-button bg-gray-800 text-white hover:bg-gray-700 animate-fade-in" style={{animationDelay: '0.4s'}}>
                  Early Primary
                </Link>
                <Link href="/age-group/late-primary" className="age-group-button bg-gray-800 text-white hover:bg-gray-700 animate-fade-in" style={{animationDelay: '0.5s'}}>
                  Late Primary
                </Link>
                <Link href="/age-group/secondary" className="age-group-button bg-gray-800 text-white hover:bg-gray-700 animate-fade-in" style={{animationDelay: '0.6s'}}>
                  Secondary
                </Link>
                <Link href="/age-group/standard" className="age-group-button bg-purple-600 text-white hover:bg-purple-700 animate-fade-in" style={{animationDelay: '0.7s'}}>
                  Standard
                </Link>
              </div>
            </div>
          </section>

          {/* User Pathways */}
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* For Students */}
                <div className="bg-white p-6 rounded-lg shadow-md animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <h2 className="text-2xl font-semibold mb-4">For Students</h2>
                  <p className="mb-6">
                    Personalised learning paths, interactive content, and tools designed to support your unique learning style.
                  </p>
                  <Link href="/student" className="btn-primary inline-flex items-center">
                    Student Portal
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>

                {/* For Educators */}
                <div className="bg-white p-6 rounded-lg shadow-md animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <h2 className="text-2xl font-semibold mb-4">For Educators</h2>
                  <p className="mb-6">
                    Evidence-based resources, assessment tools, and professional development to enhance your teaching practice.
                  </p>
                  <Link href="/educator" className="btn-secondary inline-flex items-center">
                    Educator Resources
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Resources */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-semibold mb-8 text-center">Featured Resources</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Restorative Justice */}
                <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md animate-fade-in" style={{animationDelay: '0.3s'}}>
                  <h3 className="text-xl font-semibold mb-4">Restorative Justice Practices</h3>
                  <p className="mb-6">
                    Evidence-based approaches to building community and resolving conflict in educational settings.
                  </p>
                  <Link href="/resources/restorative-justice" className="text-white hover:text-gray-300 inline-flex items-center">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>

                {/* Adaptive Learning */}
                <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <h3 className="text-xl font-semibold mb-4">Adaptive Learning Strategies</h3>
                  <p className="mb-6">
                    Personalized approaches that adapt to individual learning styles and needs.
                  </p>
                  <Link href="/resources/adaptive-learning" className="text-white hover:text-gray-300 inline-flex items-center">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>

                {/* Special Educational Needs */}
                <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md animate-fade-in" style={{animationDelay: '0.5s'}}>
                  <h3 className="text-xl font-semibold mb-4">Special Educational Needs Support</h3>
                  <p className="mb-6">
                    Resources and tools to support diverse learning needs and abilities.
                  </p>
                  <Link href="/resources/special-needs" className="text-white hover:text-gray-300 inline-flex items-center">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-semibold mb-8 text-center">Advanced Features</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Voice Input */}
                <div className="bg-white p-6 rounded-lg shadow-md animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <h3 className="text-xl font-semibold mb-4">Voice Input Technology</h3>
                  <p className="mb-6">
                    Speak instead of type with our advanced voice recognition system, designed to support students who struggle with typing.
                  </p>
                  <Link href="/features/voice-input" className="btn-primary inline-flex items-center">
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>

                {/* AI Avatar */}
                <div className="bg-white p-6 rounded-lg shadow-md animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <h3 className="text-xl font-semibold mb-4">AI Avatar Video System</h3>
                  <p className="mb-6">
                    Engage with educational content through our interactive AI avatars, designed to enhance learning experiences.
                  </p>
                  <Link href="/features/ai-avatar" className="btn-secondary inline-flex items-center">
                    Explore Avatars
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </VoiceInputProvider>
  );
}
