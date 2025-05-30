import React from 'react';
import Head from 'next/head';
import MainNavigation from '../../src/components/navigation/main-navigation';
import Footer from '../../src/components/navigation/footer';

const RestorativeJustice = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head>
        <title>Restorative Justice Practices | EdPsych Connect</title>
        <meta name="description" content="Evidence-based approaches to building community and resolving conflict in educational settings." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <MainNavigation />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Restorative Justice Practices</h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300">
            Building community and resolving conflict through restorative approaches
          </p>
        </header>
        
        <main>
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">What is Restorative Justice?</h2>
            <p className="mb-6 text-lg">
              Restorative Justice in education is an approach that focuses on repairing harm caused by conflict 
              through inclusive processes that engage all stakeholders. Rather than focusing on punishment, 
              restorative practices seek to rebuild relationships and restore community.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Core Principles</h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                  <li>Repair: Focus on repairing harm rather than punishing wrongdoing</li>
                  <li>Relationships: Build and maintain healthy relationships within the community</li>
                  <li>Responsibility: Encourage personal accountability for actions and their impact</li>
                  <li>Reintegration: Support the reintegration of all parties into the community</li>
                  <li>Respect: Foster mutual respect among all participants</li>
                </ul>
              </div>
              
              <div className="p-6 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Benefits in Education</h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                  <li>Reduced disciplinary incidents and exclusions</li>
                  <li>Improved school climate and sense of community</li>
                  <li>Enhanced student engagement and academic performance</li>
                  <li>Development of social-emotional skills and empathy</li>
                  <li>More effective conflict resolution strategies</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-12 p-8 bg-card rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Restorative Practices Toolkit</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Circle Process Tools</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Resources for implementing community circles, talking circles, and restorative conferences.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Access Tools
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Guided Conversation Frameworks</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Structured approaches for facilitating restorative conversations and mediations.
                </p>
                <div className="text-primary font-medium flex items-center">
                  View Frameworks
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="p-6 border rounded-lg hover:shadow-md transition-all duration-300 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-medium mb-3">Staff Training Materials</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Professional development resources for educators implementing restorative practices.
                </p>
                <div className="text-primary font-medium flex items-center">
                  Access Training
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
                  <h3 className="text-xl font-medium mb-3">Getting Started Guide</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Step-by-step guidance for implementing restorative practices in your educational setting.
                  </p>
                  <button className="btn-primary">Download Guide</button>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Case Studies</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    Real-world examples of successful restorative justice implementation in UK schools.
                  </p>
                  <button className="btn-primary">View Case Studies</button>
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

export default RestorativeJustice;
