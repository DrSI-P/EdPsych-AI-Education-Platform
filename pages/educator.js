import React from 'react';
import Head from 'next/head';
import MainNavigation from '../src/components/navigation/main-navigation';
import Footer from '../src/components/navigation/footer';

const EducatorResources = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head>
        <title>Educator Resources | EdPsych Connect</title>
        <meta name="description" content="Evidence-based resources, assessment tools, and professional development to enhance your teaching practice." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <MainNavigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Educator Resources</h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300">
            Evidence-based tools to enhance your teaching practice
          </p>
        </header>
        
        <main>
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Welcome to Educator Resources</h2>
            <p className="mb-6 text-lg">
              EdPsych Connect provides evidence-based resources, assessment tools, and professional development 
              opportunities designed to enhance your teaching practice and support diverse learning needs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Teaching Resources</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Access curriculum-aligned teaching materials, lesson plans, and classroom activities.
                </p>
                <div className="mt-4">
                  <button className="btn-primary">Browse Resources</button>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Assessment Tools</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Discover formative and summative assessment tools to track student progress and identify learning needs.
                </p>
                <div className="mt-4">
                  <button className="btn-primary">View Assessment Tools</button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Educational Psychology Resources</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Restorative Justice</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Implement restorative practices in your classroom to build community and resolve conflicts.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Special Needs Support</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Resources and strategies to support students with diverse learning needs and abilities.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Explore Resources
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Learning Styles</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Understand different learning styles and adapt your teaching to support diverse learners.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Discover Strategies
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Professional Development</h2>
            
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">Training & Courses</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Access professional development courses and training materials to enhance your skills.
                  </p>
                  <button className="btn-primary">Browse Courses</button>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Research & Evidence</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Stay updated with the latest educational psychology research and evidence-based practices.
                  </p>
                  <button className="btn-primary">Access Research</button>
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

export default EducatorResources;
