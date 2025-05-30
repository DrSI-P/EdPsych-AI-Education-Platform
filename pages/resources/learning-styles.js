import React from 'react';
import Head from 'next/head';
import MainNavigation from '../../src/components/ui/MainNavigation';
import Footer from '../../src/components/layout/Footer';

const LearningStylesPage = () => {
  return (
    <>
      <Head>
        <title>Learning Styles | EdPsych Connect</title>
        <meta name="description" content="Discover different learning styles and find resources tailored to visual, auditory, reading/writing, and kinesthetic learners." />
      </Head>
      
      <MainNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient animate-fade-in">
            Learning Styles
          </h1>
          <p className="text-xl mt-4 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            Discover different learning styles and find resources tailored to help every student learn in the way that works best for them.
          </p>
        </div>
        
        <div className="bg-card p-8 rounded-lg shadow-md mb-12 animate-fade-in animation-delay-300">
          <h2 className="text-3xl font-semibold mb-6">Understanding Learning Styles</h2>
          <p className="mb-4">
            Learning styles refer to the different ways individuals prefer to process, internalize, and remember new information. While everyone can learn in multiple ways, most people have preferred methods that make learning more effective and enjoyable for them.
          </p>
          <p className="mb-4">
            At EdPsych Connect, we recognize that understanding learning styles can help educators create more inclusive and effective learning environments. By providing resources that cater to different learning preferences, we can help ensure that all students have the opportunity to engage with content in ways that work best for them.
          </p>
          <p>
            Our approach is based on the VARK model (Visual, Auditory, Reading/Writing, Kinesthetic), which identifies four primary learning styles. Many learners have multimodal preferences, combining elements from different styles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-400">
            <h2 className="text-2xl font-semibold mb-4">Learning Style Assessment</h2>
            <p className="mb-4">
              Understanding your preferred learning style can help you select the most effective study strategies and resources.
            </p>
            <p className="mb-4">
              Our learning style assessment tool helps identify your primary and secondary learning preferences, providing personalized recommendations based on your results.
            </p>
            <button className="btn-primary">Take Assessment</button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-500">
            <h2 className="text-2xl font-semibold mb-4">Multimodal Learning</h2>
            <p className="mb-4">
              Most people have preferences across multiple learning styles, with varying degrees of strength in each area.
            </p>
            <p className="mb-4">
              Research suggests that engaging with content through multiple modalities can enhance learning outcomes for all students, regardless of their primary learning style.
            </p>
            <button className="btn-primary">Learn More</button>
          </div>
        </div>
        
        <h2 className="text-3xl font-semibold mb-6 animate-fade-in animation-delay-600">The Four Learning Styles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-700">
            <h3 className="text-2xl font-semibold mb-4">Visual Learners</h3>
            <div className="bg-purple-100 p-4 rounded-md mb-4 text-center">
              <p className="text-gray-700">Prefer images, diagrams, and spatial understanding</p>
            </div>
            <h4 className="font-medium mb-2">Characteristics:</h4>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Think in pictures and visualize concepts</li>
              <li>Benefit from charts, graphs, and diagrams</li>
              <li>Remember faces better than names</li>
              <li>Notice visual details</li>
              <li>Prefer demonstrations over verbal instructions</li>
            </ul>
            <button className="btn-primary w-full">Visual Learning Resources</button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-800">
            <h3 className="text-2xl font-semibold mb-4">Auditory Learners</h3>
            <div className="bg-blue-100 p-4 rounded-md mb-4 text-center">
              <p className="text-gray-700">Prefer listening and speaking to process information</p>
            </div>
            <h4 className="font-medium mb-2">Characteristics:</h4>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Learn well through lectures and discussions</li>
              <li>Remember spoken information easily</li>
              <li>Benefit from reading aloud</li>
              <li>May talk through problems to solve them</li>
              <li>Often enjoy music and recognize sounds well</li>
            </ul>
            <button className="btn-primary w-full">Auditory Learning Resources</button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-900">
            <h3 className="text-2xl font-semibold mb-4">Reading/Writing Learners</h3>
            <div className="bg-green-100 p-4 rounded-md mb-4 text-center">
              <p className="text-gray-700">Prefer text-based input and output</p>
            </div>
            <h4 className="font-medium mb-2">Characteristics:</h4>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Learn best through reading and writing</li>
              <li>Take detailed notes during lessons</li>
              <li>Enjoy making lists and writing essays</li>
              <li>Prefer written instructions over verbal ones</li>
              <li>Often enjoy word-based games and puzzles</li>
            </ul>
            <button className="btn-primary w-full">Reading/Writing Resources</button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in animation-delay-1000">
            <h3 className="text-2xl font-semibold mb-4">Kinesthetic Learners</h3>
            <div className="bg-orange-100 p-4 rounded-md mb-4 text-center">
              <p className="text-gray-700">Prefer hands-on experiences and physical activities</p>
            </div>
            <h4 className="font-medium mb-2">Characteristics:</h4>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Learn by doing and direct involvement</li>
              <li>Benefit from hands-on activities</li>
              <li>May find it difficult to sit still for long periods</li>
              <li>Often use gestures when speaking</li>
              <li>Remember what they've done rather than what they've seen or heard</li>
            </ul>
            <button className="btn-primary w-full">Kinesthetic Learning Resources</button>
          </div>
        </div>
        
        <div className="bg-card p-8 rounded-lg shadow-md mb-12 animate-fade-in animation-delay-1100">
          <h2 className="text-3xl font-semibold mb-6">Teaching Strategies for Different Learning Styles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-3">For Visual Learners:</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Use diagrams, charts, and mind maps</li>
                <li>Incorporate color-coding and highlighting</li>
                <li>Provide visual aids during lessons</li>
                <li>Use videos and demonstrations</li>
                <li>Create visual analogies and metaphors</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3">For Auditory Learners:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Incorporate discussions and debates</li>
                <li>Use audio recordings and podcasts</li>
                <li>Encourage verbal summarization</li>
                <li>Implement group discussions</li>
                <li>Use rhythm, rhyme, and music</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">For Reading/Writing Learners:</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Provide written materials and handouts</li>
                <li>Assign essays and written assignments</li>
                <li>Encourage note-taking</li>
                <li>Use text-based resources</li>
                <li>Incorporate written reflections</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3">For Kinesthetic Learners:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Incorporate hands-on activities</li>
                <li>Use role-playing and simulations</li>
                <li>Include movement breaks</li>
                <li>Create physical models</li>
                <li>Implement project-based learning</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in animation-delay-1200">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Multi-Modal Resources</h2>
            <p className="mb-4">
              Explore our collection of resources designed to engage multiple learning styles simultaneously, providing rich, multi-sensory learning experiences.
            </p>
            <button className="btn-primary">Browse Resources</button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">For Educators</h2>
            <p className="mb-4">
              Access professional development materials on differentiating instruction to accommodate diverse learning styles in your classroom.
            </p>
            <button className="btn-primary">Educator Resources</button>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">For Parents</h2>
            <p className="mb-4">
              Discover strategies to support your child's learning at home based on their preferred learning style and educational needs.
            </p>
            <button className="btn-primary">Parent Resources</button>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default LearningStylesPage;
