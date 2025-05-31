import React from 'react';
import Head from 'next/head';
import MainNavigation from '../../src/components/ui/MainNavigation';
import Footer from '../../src/components/layout/Footer';
import Link from 'next/link';

const RestorativeJustice = () => {
  return (
    <>
      <Head>
        <title>Restorative Justice in Education | EdPsych Connect</title>
        <meta name="description" content="Comprehensive resources on restorative justice principles and implementation in educational settings." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNavigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-gradient animate-fade-in mb-4 text-center">
            Restorative Justice in Education
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Evidence-based approaches to building community, repairing harm, and fostering positive relationships in educational settings.
          </p>
        </section>

        {/* Introduction Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-card rounded-lg shadow-md p-8 border border-neutral-200">
            <h2 className="text-2xl font-bold mb-4">What is Restorative Justice?</h2>
            <p className="mb-4">
              Restorative Justice in education is an approach that focuses on repairing harm caused by conflict and wrongdoing through inclusive, collaborative processes that engage all stakeholders. Unlike traditional punitive disciplinary measures, restorative practices seek to address the needs of those who have been harmed while encouraging those who caused harm to take responsibility for their actions.
            </p>
            <p className="mb-4">
              This approach is grounded in indigenous practices and modern conflict resolution theories, emphasizing the importance of relationships, community building, and collective problem-solving. In educational settings, restorative justice creates safer, more supportive learning environments where all members feel valued and respected.
            </p>
            <p>
              The UK Department for Education recognizes restorative approaches as effective strategies for improving behaviour and reducing exclusions in schools, aligning with the focus on developing positive relationships and emotional literacy.
            </p>
          </div>
        </section>

        {/* Core Principles Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold mb-6">Core Principles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Repair */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Repair</h3>
              <p className="text-neutral-700">
                Focuses on healing the harm caused by conflict or wrongdoing rather than simply punishing rule-breaking. This involves identifying who has been affected and what they need to move forward positively.
              </p>
            </div>
            
            {/* Relationships */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Relationships</h3>
              <p className="text-neutral-700">
                Prioritizes building and maintaining healthy relationships within the school community. Recognizes that strong relationships are the foundation for learning and growth.
              </p>
            </div>
            
            {/* Responsibility */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Responsibility</h3>
              <p className="text-neutral-700">
                Encourages individuals to take responsibility for their actions and the impact these actions have on others. Supports accountability without shame or stigma.
              </p>
            </div>
            
            {/* Respect */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Respect</h3>
              <p className="text-neutral-700">
                Treats all individuals with dignity and worth, regardless of their actions. Creates spaces where diverse perspectives are valued and heard.
              </p>
            </div>
            
            {/* Reintegration */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Reintegration</h3>
              <p className="text-neutral-700">
                Aims to restore individuals to the community after harm has occurred. Focuses on healing and moving forward rather than isolation or exclusion.
              </p>
            </div>
            
            {/* Inclusive Decision-Making */}
            <div className="card p-6">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Inclusive Decision-Making</h3>
              <p className="text-neutral-700">
                Involves all affected parties in the process of addressing harm and finding solutions. Empowers students, staff, and community members to participate actively.
              </p>
            </div>
          </div>
        </section>

        {/* Implementation Resources Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-2xl font-bold mb-6">Implementation Resources</h2>
          
          <div className="bg-card rounded-lg shadow-md p-8 border border-neutral-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
                <p className="mb-4">
                  Implementing restorative practices requires thoughtful planning and a whole-school approach. These resources will help you begin your restorative journey:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">School Readiness Assessment</h4>
                      <p className="text-sm text-neutral-600">Evaluate your school's current climate and readiness for restorative approaches</p>
                      <Link href="/resources/downloads/rj-readiness-assessment.pdf" className="text-primary text-sm hover:underline">
                        Download Assessment →
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Implementation Guide</h4>
                      <p className="text-sm text-neutral-600">Step-by-step guide for introducing restorative practices in your school</p>
                      <Link href="/resources/downloads/rj-implementation-guide.pdf" className="text-primary text-sm hover:underline">
                        Download Guide →
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Policy Development Templates</h4>
                      <p className="text-sm text-neutral-600">Templates for creating restorative policies aligned with UK educational standards</p>
                      <Link href="/resources/downloads/rj-policy-templates.pdf" className="text-primary text-sm hover:underline">
                        Download Templates →
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Research & Evidence</h3>
                <p className="mb-4">
                  Restorative justice approaches are supported by a growing body of research demonstrating their effectiveness in educational settings:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <div>
                      <h4 className="font-medium">UK Research Summary</h4>
                      <p className="text-sm text-neutral-600">Summary of research on restorative practices in UK schools</p>
                      <Link href="/resources/research/rj-uk-research.pdf" className="text-primary text-sm hover:underline">
                        Read Research →
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Case Studies</h4>
                      <p className="text-sm text-neutral-600">Real-world examples of successful implementation in diverse school settings</p>
                      <Link href="/resources/case-studies/rj-case-studies.pdf" className="text-primary text-sm hover:underline">
                        View Case Studies →
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Impact Measurement</h4>
                      <p className="text-sm text-neutral-600">Tools for measuring the impact of restorative approaches in your setting</p>
                      <Link href="/resources/downloads/rj-impact-measurement.pdf" className="text-primary text-sm hover:underline">
                        Download Tools →
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-2xl font-bold mb-6">Tools & Practices</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Circle Process */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Circle Process</h3>
              <p className="mb-4">
                The circle process is a foundational restorative practice that brings people together to build community, address harm, or make decisions collectively. Circles create a safe space where all voices are heard equally.
              </p>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Key Components:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Talking piece to regulate communication</li>
                  <li>Opening and closing ceremonies</li>
                  <li>Shared values and guidelines</li>
                  <li>Facilitation by a circle keeper</li>
                  <li>Rounds of dialogue with prompting questions</li>
                </ul>
              </div>
              <Link href="/resources/tools/circle-process-guide.pdf" className="btn-outline inline-block">
                Download Circle Guide
              </Link>
            </div>
            
            {/* Guided Conversations */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Guided Conversations</h3>
              <p className="mb-4">
                Restorative conversations provide a structured framework for addressing harm and conflict between individuals. These conversations focus on understanding impact and finding ways to repair relationships.
              </p>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Key Questions:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>What happened?</li>
                  <li>What were you thinking/feeling at the time?</li>
                  <li>Who has been affected and how?</li>
                  <li>What do you need to move forward?</li>
                  <li>What can be done to repair the harm?</li>
                </ul>
              </div>
              <Link href="/resources/tools/restorative-conversation-cards.pdf" className="btn-outline inline-block">
                Download Conversation Cards
              </Link>
            </div>
            
            {/* Staff Training */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Staff Training Resources</h3>
              <p className="mb-4">
                Comprehensive training materials to help staff develop the skills and mindset needed for effective restorative practice implementation.
              </p>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Training Modules:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Introduction to Restorative Philosophy</li>
                  <li>Facilitating Restorative Circles</li>
                  <li>Restorative Language and Communication</li>
                  <li>Managing Complex Situations</li>
                  <li>Embedding Restorative Culture</li>
                </ul>
              </div>
              <Link href="/resources/training/staff-training-modules.pdf" className="btn-outline inline-block">
                Access Training Materials
              </Link>
            </div>
            
            {/* Student Leadership */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Student Leadership Programme</h3>
              <p className="mb-4">
                Resources for developing student restorative leaders who can support peer mediation and help embed restorative values throughout the school community.
              </p>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Programme Components:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Peer mediator training</li>
                  <li>Circle facilitation skills</li>
                  <li>Conflict resolution techniques</li>
                  <li>Emotional literacy development</li>
                  <li>Leadership and advocacy skills</li>
                </ul>
              </div>
              <Link href="/resources/tools/student-leadership-programme.pdf" className="btn-outline inline-block">
                Download Programme Guide
              </Link>
            </div>
          </div>
        </section>

        {/* Additional Resources Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
          
          <div className="bg-card rounded-lg shadow-md p-6 border border-neutral-200">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Books & Publications</h3>
                <ul className="space-y-2">
                  <li>
                    <p className="font-medium">Restorative Justice in Schools: Building Relationships, Repairing Harm</p>
                    <p className="text-sm text-neutral-600">Hopkins, B. (2021)</p>
                  </li>
                  <li>
                    <p className="font-medium">Just Schools: A Whole School Approach to Restorative Justice</p>
                    <p className="text-sm text-neutral-600">Hopkins, B. (2004)</p>
                  </li>
                  <li>
                    <p className="font-medium">The Restorative Practices Handbook</p>
                    <p className="text-sm text-neutral-600">Costello, B., Wachtel, J., & Wachtel, T. (2019)</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Organisations & Networks</h3>
                <ul className="space-y-2">
                  <li>
                    <p className="font-medium">Restorative Justice Council (UK)</p>
                    <Link href="https://restorativejustice.org.uk" className="text-primary text-sm hover:underline">
                      Visit Website →
                    </Link>
                  </li>
                  <li>
                    <p className="font-medium">International Institute for Restorative Practices</p>
                    <Link href="https://www.iirp.edu" className="text-primary text-sm hover:underline">
                      Visit Website →
                    </Link>
                  </li>
                  <li>
                    <p className="font-medium">Transforming Conflict (UK)</p>
                    <Link href="https://transformingconflict.org" className="text-primary text-sm hover:underline">
                      Visit Website →
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Professional Development</h3>
                <ul className="space-y-2">
                  <li>
                    <p className="font-medium">Restorative Approaches Practitioner Training</p>
                    <Link href="/pd/courses/restorative-practitioner" className="text-primary text-sm hover:underline">
                      Course Details →
                    </Link>
                  </li>
                  <li>
                    <p className="font-medium">Advanced Facilitation Skills</p>
                    <Link href="/pd/courses/advanced-facilitation" className="text-primary text-sm hover:underline">
                      Course Details →
                    </Link>
                  </li>
                  <li>
                    <p className="font-medium">Whole School Implementation</p>
                    <Link href="/pd/courses/whole-school-rj" className="text-primary text-sm hover:underline">
                      Course Details →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/contact/restorative-justice-support" className="btn-primary inline-block">
                Request Personalised Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default RestorativeJustice;
