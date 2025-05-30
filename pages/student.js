import React from 'react';
import Head from 'next/head';
import MainNavigation from '../src/components/navigation/main-navigation';
import Footer from '../src/components/navigation/footer';

const StudentPortal = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head>
        <title>Student Portal | EdPsych Connect</title>
        <meta name="description" content="Personalized learning paths, interactive content, and tools designed to support your unique learning style." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <MainNavigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Student Portal</h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300">
            Your personalized learning journey starts here
          </p>
        </header>
        
        <main>
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Welcome to Your Learning Space</h2>
            <p className="mb-6 text-lg">
              The EdPsych Connect Student Portal is designed to provide you with a personalized learning experience
              tailored to your unique learning style, interests, and educational needs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Your Learning Path</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Access your personalized learning journey, track your progress, and discover new educational resources.
                </p>
                <div className="mt-4">
                  <button className="btn-primary">View My Learning Path</button>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Assignments & Activities</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  View your current assignments, upcoming activities, and complete interactive exercises.
                </p>
                <div className="mt-4">
                  <button className="btn-primary">View Assignments</button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Learning Resources</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Learning Style Tools</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Resources tailored to your visual, auditory, or kinesthetic learning preferences.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Explore Tools
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Emotional Wellbeing</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Tools and resources to support your emotional health and wellbeing.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Access Support
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Executive Function Support</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Tools to help with organization, time management, and planning.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Get Organized
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Your Progress</h2>
            
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <p className="text-center text-lg mb-6">
                Your learning progress dashboard will appear here once you begin your learning journey.
              </p>
              
              <div className="flex justify-center">
                <button className="btn-primary">Start Learning Now</button>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentPortal;
