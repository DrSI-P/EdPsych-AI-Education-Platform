import React from 'react';
import Head from 'next/head';
import MainNavigation from '../../src/components/ui/MainNavigation';
import Footer from '../../src/components/layout/Footer';
import Link from 'next/link';

const SpecialNeeds = () => {
  return (
    <>
      <Head>
        <title>Special Educational Needs Support | EdPsych Connect</title>
        <meta name="description" content="Comprehensive resources and tools to support diverse learning needs and abilities in educational settings." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNavigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-gradient animate-fade-in mb-4 text-center">
            Special Educational Needs Support
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Evidence-based resources and tools to support students with diverse learning needs, helping create inclusive learning environments where all students can thrive.
          </p>
        </section>

        {/* Introduction Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-card rounded-lg shadow-md p-8 border border-neutral-200">
            <h2 className="text-2xl font-bold mb-4">Supporting Special Educational Needs</h2>
            <p className="mb-4">
              EdPsych Connect provides evidence-based resources and tools to support students with diverse learning needs, helping educators and parents create inclusive learning environments that enable all students to thrive.
            </p>
            <p className="mb-4">
              Our approach is grounded in educational psychology research and focuses on identifying individual strengths and needs, implementing targeted interventions, and monitoring progress to ensure effective support.
            </p>
            <p>
              We believe that with the right support, all students can achieve their potential and develop the skills they need for success in school and beyond.
            </p>
          </div>
        </section>

        {/* Areas of Support Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold mb-6">Areas of Support</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dyslexia */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Dyslexia & Reading Difficulties</h3>
              <p className="text-neutral-700 mb-4">
                Support for students who struggle with reading, writing, spelling, and processing text-based information.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Structured literacy approaches</li>
                <li>Multisensory teaching strategies</li>
                <li>Assistive technology recommendations</li>
                <li>Reading comprehension supports</li>
              </ul>
              <Link href="/resources/special-needs/dyslexia" className="text-primary hover:underline flex items-center">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* ADHD */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">ADHD & Executive Function</h3>
              <p className="text-neutral-700 mb-4">
                Strategies to support attention, focus, organisation, planning, and self-regulation.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Classroom accommodations</li>
                <li>Executive function skill development</li>
                <li>Self-monitoring techniques</li>
                <li>Environmental modifications</li>
              </ul>
              <Link href="/resources/special-needs/adhd" className="text-primary hover:underline flex items-center">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* Autism */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Autism Spectrum Conditions</h3>
              <p className="text-neutral-700 mb-4">
                Resources to support social communication, sensory needs, and flexible thinking.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Social communication supports</li>
                <li>Sensory-friendly adaptations</li>
                <li>Visual supports and schedules</li>
                <li>Emotional regulation strategies</li>
              </ul>
              <Link href="/resources/special-needs/autism" className="text-primary hover:underline flex items-center">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* Speech and Language */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Speech & Language Needs</h3>
              <p className="text-neutral-700 mb-4">
                Support for receptive and expressive language, speech sound development, and communication.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Language development activities</li>
                <li>Alternative communication systems</li>
                <li>Vocabulary building strategies</li>
                <li>Classroom communication supports</li>
              </ul>
              <Link href="/resources/special-needs/speech-language" className="text-primary hover:underline flex items-center">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* SEMH */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Social, Emotional & Mental Health</h3>
              <p className="text-neutral-700 mb-4">
                Resources to support emotional regulation, social skills, and mental wellbeing.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Emotional literacy development</li>
                <li>Self-regulation techniques</li>
                <li>Social skills programmes</li>
                <li>Anxiety management strategies</li>
              </ul>
              <Link href="/resources/special-needs/semh" className="text-primary hover:underline flex items-center">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* Physical and Sensory */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Physical & Sensory Needs</h3>
              <p className="text-neutral-700 mb-4">
                Support for students with physical disabilities, visual or hearing impairments, and sensory processing differences.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Accessibility adaptations</li>
                <li>Assistive technology solutions</li>
                <li>Sensory integration strategies</li>
                <li>Inclusive physical activities</li>
              </ul>
              <Link href="/resources/special-needs/physical-sensory" className="text-primary hover:underline flex items-center">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Support Resources Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-2xl font-bold mb-6">Support Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Assessment Tools */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Assessment Tools</h3>
              <p className="text-neutral-700 mb-4">
                Tools to identify learning needs and monitor progress over time.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Screening checklists</li>
                <li>Observation frameworks</li>
                <li>Progress monitoring tools</li>
                <li>Functional behaviour assessments</li>
              </ul>
              <Link href="/resources/tools/assessment" className="btn-outline inline-block">
                Access Tools
              </Link>
            </div>
            
            {/* Intervention Strategies */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Intervention Strategies</h3>
              <p className="text-neutral-700 mb-4">
                Evidence-based interventions for different learning needs and challenges.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Targeted academic interventions</li>
                <li>Social skills programmes</li>
                <li>Behaviour support strategies</li>
                <li>Therapeutic approaches</li>
              </ul>
              <Link href="/resources/tools/interventions" className="btn-outline inline-block">
                View Strategies
              </Link>
            </div>
            
            {/* Classroom Accommodations */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Classroom Accommodations</h3>
              <p className="text-neutral-700 mb-4">
                Practical adjustments to support inclusive learning environments.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-4">
                <li>Environmental modifications</li>
                <li>Instructional adaptations</li>
                <li>Assessment accommodations</li>
                <li>Assistive technology solutions</li>
              </ul>
              <Link href="/resources/tools/accommodations" className="btn-outline inline-block">
                Explore Accommodations
              </Link>
            </div>
          </div>
        </section>

        {/* Support for Educators and Parents Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-2xl font-bold mb-6">Support for Educators and Parents</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Educators */}
            <div className="bg-card rounded-lg shadow-md p-8 border border-neutral-200">
              <h3 className="text-xl font-semibold mb-4">For Educators</h3>
              <p className="mb-4">
                Professional development resources, classroom strategies, and support for implementing inclusive practices.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-6">
                <li>Differentiation strategies for diverse learners</li>
                <li>Classroom management techniques</li>
                <li>IEP/EHC plan development guidance</li>
                <li>Collaborative team approaches</li>
                <li>Professional development modules</li>
              </ul>
              <Link href="/resources/educators/special-needs" className="btn-primary inline-block">
                Educator Resources
              </Link>
            </div>
            
            {/* For Parents */}
            <div className="bg-card rounded-lg shadow-md p-8 border border-neutral-200">
              <h3 className="text-xl font-semibold mb-4">For Parents</h3>
              <p className="mb-4">
                Guidance for supporting your child at home, understanding rights and entitlements, and collaborating with schools.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 mb-6">
                <li>Home learning support strategies</li>
                <li>Understanding the SEND system</li>
                <li>Advocacy and rights information</li>
                <li>Parent-school collaboration guides</li>
                <li>Community support networks</li>
              </ul>
              <Link href="/resources/parents/special-needs" className="btn-primary inline-block">
                Parent Resources
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SpecialNeeds;
