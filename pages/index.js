import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarVideoPlayer } from '../src/components/Avatar';
import { VoiceInputButton } from '../src/components/VoiceInput';
import MainNavigation from '../src/components/ui/MainNavigation';
import Footer from '../src/components/layout/Footer';

export default function Home() {
  const [ageGroup, setAgeGroup] = useState('standard');
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceInputText, setVoiceInputText] = useState('');

  // Handle age group selection
  const handleAgeGroupChange = (group) => {
    setAgeGroup(group);
    // Store preference in localStorage
    localStorage.setItem('edpsych-age-group', group);
  };

  // Load age group preference from localStorage on initial render
  useEffect(() => {
    const savedAgeGroup = localStorage.getItem('edpsych-age-group');
    if (savedAgeGroup) {
      setAgeGroup(savedAgeGroup);
    }
  }, []);

  // Handle welcome video completion
  const handleWelcomeVideoComplete = () => {
    setShowWelcomeVideo(false);
    localStorage.setItem('edpsych-welcome-viewed', 'true');
  };

  // Handle voice input result
  const handleVoiceInput = (text) => {
    setVoiceInputText(text);
    setSearchQuery(text);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>EdPsych Connect - Personalised Learning for All Students</title>
        <meta name="description" content="EdPsych Connect is a comprehensive platform designed by educational psychologists to provide personalised learning experiences for all students." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles/global.css" />
      </Head>

      <MainNavigation />

      <main className="flex-grow">
        {/* Hero Section with Avatar Introduction */}
        <section className="bg-gradient-to-b from-white to-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Welcome to EdPsych Connect</h1>
                <p className="text-lg mb-8">
                  EdPsych Connect is a comprehensive platform designed by educational psychologists to provide personalised learning experiences for all students.
                </p>
              </div>

              {showWelcomeVideo ? (
                <div className="mb-12 animate-fade-in">
                  <AvatarVideoPlayer
                    videoId="intro-platform"
                    title="Platform Introduction"
                    description="Welcome to EdPsych Connect! Let me guide you through our platform designed to support your educational journey."
                    avatarId="guide"
                    ageGroup={ageGroup}
                    autoPlay={true}
                    controls={true}
                    onComplete={handleWelcomeVideoComplete}
                  />
                </div>
              ) : (
                <div className="flex justify-center mb-8">
                  <button 
                    onClick={() => setShowWelcomeVideo(true)}
                    className="btn-secondary inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Introduction Video
                  </button>
                </div>
              )}

              {/* Age Group Selection */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-center">Select Age Group:</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    className={`px-6 py-3 rounded-full text-lg transition-all ${ageGroup === 'nursery' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    onClick={() => handleAgeGroupChange('nursery')}
                  >
                    Nursery
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-full text-lg transition-all ${ageGroup === 'early-primary' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    onClick={() => handleAgeGroupChange('early-primary')}
                  >
                    Early Primary
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-full text-lg transition-all ${ageGroup === 'late-primary' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    onClick={() => handleAgeGroupChange('late-primary')}
                  >
                    Late Primary
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-full text-lg transition-all ${ageGroup === 'secondary' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    onClick={() => handleAgeGroupChange('secondary')}
                  >
                    Secondary
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-full text-lg transition-all ${ageGroup === 'standard' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    onClick={() => handleAgeGroupChange('standard')}
                  >
                    Standard
                  </button>
                </div>
              </div>

              {/* Voice-enabled Search */}
              <div className="max-w-2xl mx-auto mb-12">
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for resources, topics, or help..."
                      className="w-full px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <VoiceInputButton 
                        onResult={handleVoiceInput}
                        ageGroup={ageGroup}
                        buttonStyle="icon"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-3 rounded-r-lg hover:bg-purple-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </form>
                {voiceInputText && (
                  <p className="mt-2 text-sm text-gray-600">
                    Voice input: "{voiceInputText}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* User Pathways */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* For Students */}
              <div className="bg-gray-50 rounded-lg shadow-md p-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
                <h2 className="text-3xl font-bold mb-4 text-gradient">For Students</h2>
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
              <div className="bg-gray-50 rounded-lg shadow-md p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h2 className="text-3xl font-bold mb-4 text-gradient">For Educators</h2>
                <p className="mb-6">
                  Evidence-based resources, assessment tools, and professional development to enhance your teaching practice.
                </p>
                <Link href="/educator" className="btn-primary inline-flex items-center">
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
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-gradient">Featured Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Restorative Justice */}
              <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Restorative Justice Practices</h3>
                  <p className="mb-6">
                    Evidence-based approaches to building community and resolving conflict in educational settings.
                  </p>
                  <Link href="/resources/restorative-justice" className="text-white inline-flex items-center hover:underline">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Adaptive Learning */}
              <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Adaptive Learning Strategies</h3>
                  <p className="mb-6">
                    Personalized approaches that adapt to individual learning styles and needs.
                  </p>
                  <Link href="/resources/adaptive-learning" className="text-white inline-flex items-center hover:underline">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Special Educational Needs */}
              <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Special Educational Needs Support</h3>
                  <p className="mb-6">
                    Resources and tools to support diverse learning needs and abilities.
                  </p>
                  <Link href="/resources/special-needs" className="text-white inline-flex items-center hover:underline">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Avatar Video Navigation */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-gradient">Platform Navigation Videos</h2>
              <p className="text-lg mb-8">
                Our AI avatar guides will help you navigate the platform and discover all its features.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg shadow-md p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <div className="flex items-center mb-4">
                    <Avatar 
                      avatarId="student"
                      size="small"
                      className="mr-4"
                    />
                    <h3 className="text-xl font-semibold">Student Portal Guide</h3>
                  </div>
                  <p className="mb-6 text-gray-600">Learn how to use the personalized learning tools and resources in the student portal.</p>
                  <Link 
                    href="/avatar-video/student-portal"
                    className="btn-secondary inline-flex items-center"
                  >
                    Watch Video
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <div className="bg-gray-50 rounded-lg shadow-md p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <div className="flex items-center mb-4">
                    <Avatar 
                      avatarId="teacher"
                      size="small"
                      className="mr-4"
                    />
                    <h3 className="text-xl font-semibold">Educator Resources Guide</h3>
                  </div>
                  <p className="mb-6 text-gray-600">Discover the teaching resources and assessment tools available for educators.</p>
                  <Link 
                    href="/avatar-video/educator-resources"
                    className="btn-secondary inline-flex items-center"
                  >
                    Watch Video
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
              <Link href="/avatar-library" className="btn-primary">
                View All Avatar Videos
              </Link>
            </div>
          </div>
        </section>

        {/* Voice Input Feature */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                  <h2 className="text-3xl font-bold mb-4 text-gradient">Voice Input Support</h2>
                  <p className="mb-4">
                    Our platform features voice input technology to support children who struggle with typing, making digital learning more accessible for all.
                  </p>
                  <p className="mb-6">
                    Try it now by clicking the microphone button and speaking your query.
                  </p>
                  <Link 
                    href="/avatar-video/voice-input"
                    className="btn-secondary inline-flex items-center"
                  >
                    Watch Tutorial
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <div className="text-center mb-4">
                      <VoiceInputButton 
                        onResult={handleVoiceInput}
                        ageGroup={ageGroup}
                        buttonStyle="large"
                        className="mx-auto"
                      />
                    </div>
                    <p className="text-center text-gray-600">
                      Click the microphone and speak to try voice input
                    </p>
                    {voiceInputText && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <p className="font-medium">You said:</p>
                        <p className="italic">"{voiceInputText}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
