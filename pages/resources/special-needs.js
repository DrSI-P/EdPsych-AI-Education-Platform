import React from 'react';
import Head from 'next/head';
import MainNavigation from '../../src/components/ui/MainNavigation';
import Footer from '../../src/components/layout/Footer';

const SpecialNeeds = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head>
        <title>Special Educational Needs Support | EdPsych Connect</title>
        <meta name="description" content="Resources and tools to support diverse learning needs and abilities." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <MainNavigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Special Educational Needs Support</h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300">
            Resources and tools to support diverse learning needs and abilities
          </p>
        </header>
        
        <main>
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Supporting Special Educational Needs</h2>
            <p className="mb-6 text-lg">
              EdPsych Connect provides evidence-based resources and tools to support students with diverse 
              learning needs, helping educators and parents create inclusive learning environments that 
              enable all students to thrive.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Our Approach</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Our approach to supporting special educational needs is based on:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300 mt-3">
                  <li>Personalized interventions tailored to individual needs</li>
                  <li>Evidence-based strategies grounded in educational psychology</li>
                  <li>Inclusive design principles that benefit all learners</li>
                  <li>Collaborative approaches involving educators, parents, and specialists</li>
                  <li>Regular progress monitoring and adaptation</li>
                </ul>
              </div>
              
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Areas of Support</h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                  <li>Dyslexia and reading difficulties</li>
                  <li>ADHD and executive function challenges</li>
                  <li>Autism spectrum conditions</li>
                  <li>Speech and language needs</li>
                  <li>Social, emotional, and mental health needs</li>
                  <li>Physical and sensory needs</li>
                  <li>Developmental coordination difficulties</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Support Resources</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Assessment Tools</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Tools to identify learning needs and monitor progress over time.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Access Tools
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Intervention Strategies</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Evidence-based interventions for different learning needs and challenges.
                </p>
                <div className="text-primary font-medium flex items-center">
                  View Strategies
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Classroom Accommodations</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Practical adjustments to support inclusive learning environments.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Explore Accommodations
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Support for Educators and Parents</h2>
            
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">For Educators</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Professional development resources, classroom strategies, and support for IEP/504 plan implementation.
                  </p>
                  <button className="btn-primary">Educator Resources</button>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">For Parents</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Guidance for supporting your child at home, understanding rights and entitlements, and collaborating with schools.
                  </p>
                  <button className="btn-primary">Parent Resources</button>
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

export default SpecialNeeds;
