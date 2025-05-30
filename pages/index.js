import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MainNavigation from '../src/components/ui/MainNavigation';
import Footer from '../src/components/layout/Footer';
import { Avatar, AvatarVideoPlayer } from '../src/components/Avatar';

export default function Home() {
  const [currentVideoId, setCurrentVideoId] = useState('intro-platform');
  const [ageGroup, setAgeGroup] = useState('standard');
  const [videoCompleted, setVideoCompleted] = useState(false);
  
  // Mock data for the introduction video
  const introVideo = {
    id: 'intro-platform',
    title: 'Welcome to EdPsych Connect',
    description: 'An introduction to the EdPsych Connect platform designed by educational psychologists to provide personalised learning experiences for all students.',
    avatarId: 'guide'
  };

  // Handle video completion
  const handleVideoComplete = () => {
    setVideoCompleted(true);
  };

  // Handle age group selection
  const handleAgeGroupSelect = (group) => {
    setAgeGroup(group);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>EdPsych Connect - Personalised Learning for All Students</title>
        <meta name="description" content="EdPsych Connect is a comprehensive platform designed by educational psychologists to provide personalised learning experiences for all students." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainNavigation />

      <main className="flex-grow">
        {/* Hero Section with Avatar Video */}
        <section className="bg-gradient-to-b from-white to-gray-100 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                    Welcome to EdPsych Connect
                  </h1>
                  <p className="text-lg mb-6">
                    A comprehensive platform designed by educational psychologists to provide personalised learning experiences for all students.
                  </p>
                  {videoCompleted && (
                    <div className="flex flex-wrap gap-4 animate-fade-in">
                      <Link href="/student" className="btn-primary">
                        Student Portal
                      </Link>
                      <Link href="/educator" className="btn-secondary">
                        Educator Resources
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="order-first md:order-last">
                  <AvatarVideoPlayer
                    videoId={introVideo.id}
                    title={introVideo.title}
                    description={introVideo.description}
                    avatarId={introVideo.avatarId}
                    ageGroup={ageGroup}
                    autoPlay={true}
                    onComplete={handleVideoComplete}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Age Group Selection */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-6 text-center">Select Age Group:</h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <button 
                onClick={() => handleAgeGroupSelect('nursery')}
                className={`age-group-button ${ageGroup === 'nursery' ? 'bg-purple-600' : 'bg-gray-800'} text-white hover:bg-purple-700 animate-fade-in`}
                style={{animationDelay: '0.1s'}}
              >
                Nursery
              </button>
              <button 
                onClick={() => handleAgeGroupSelect('early-primary')}
                className={`age-group-button ${ageGroup === 'early-primary' ? 'bg-blue-600' : 'bg-gray-800'} text-white hover:bg-blue-700 animate-fade-in`}
                style={{animationDelay: '0.2s'}}
              >
                Early Primary
              </button>
              <button 
                onClick={() => handleAgeGroupSelect('late-primary')}
                className={`age-group-button ${ageGroup === 'late-primary' ? 'bg-teal-600' : 'bg-gray-800'} text-white hover:bg-teal-700 animate-fade-in`}
                style={{animationDelay: '0.3s'}}
              >
                Late Primary
              </button>
              <button 
                onClick={() => handleAgeGroupSelect('secondary')}
                className={`age-group-button ${ageGroup === 'secondary' ? 'bg-indigo-600' : 'bg-gray-800'} text-white hover:bg-indigo-700 animate-fade-in`}
                style={{animationDelay: '0.4s'}}
              >
                Secondary
              </button>
              <button 
                onClick={() => handleAgeGroupSelect('standard')}
                className={`age-group-button ${ageGroup === 'standard' ? 'bg-purple-600' : 'bg-gray-800'} text-white hover:bg-purple-700 animate-fade-in`}
                style={{animationDelay: '0.5s'}}
              >
                Standard
              </button>
            </div>
          </div>
        </section>

        {/* User Pathways */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* For Students */}
              <div className="bg-white p-6 rounded-lg shadow-md animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center mb-4">
                  <Avatar 
                    avatarId="student"
                    size="small"
                    ageGroup={ageGroup}
                    className="mr-4"
                  />
                  <h2 className="text-2xl font-semibold">For Students</h2>
                </div>
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
                <div className="flex items-center mb-4">
                  <Avatar 
                    avatarId="teacher"
                    size="small"
                    ageGroup={ageGroup}
                    className="mr-4"
                  />
                  <h2 className="text-2xl font-semibold">For Educators</h2>
                </div>
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
                <div className="flex items-center mb-4">
                  <Avatar 
                    avatarId="counselor"
                    size="small"
                    ageGroup={ageGroup}
                    className="mr-4"
                  />
                  <h3 className="text-xl font-semibold">Restorative Justice</h3>
                </div>
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
                <div className="flex items-center mb-4">
                  <Avatar 
                    avatarId="professor"
                    size="small"
                    ageGroup={ageGroup}
                    className="mr-4"
                  />
                  <h3 className="text-xl font-semibold">Adaptive Learning</h3>
                </div>
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
                <div className="flex items-center mb-4">
                  <Avatar 
                    avatarId="therapist"
                    size="small"
                    ageGroup={ageGroup}
                    className="mr-4"
                  />
                  <h3 className="text-xl font-semibold">Special Needs Support</h3>
                </div>
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

        {/* Avatar Video Library Preview */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-8 text-center">Explore Our Avatar Video Library</h2>
            <div className="text-center mb-8">
              <p className="text-lg max-w-3xl mx-auto">
                Access our library of 18 educational avatar videos to help you navigate the platform and learn about key features.
              </p>
            </div>
            <div className="flex justify-center">
              <Link href="/avatar-library" className="btn-primary inline-flex items-center">
                View All Avatar Videos
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
