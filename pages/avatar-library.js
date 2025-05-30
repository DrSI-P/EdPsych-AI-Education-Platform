import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Avatar, AvatarVideoPlayer } from '../src/components/Avatar';

export default function AvatarLibrary() {
  // Mock data for the 18 strategic avatar videos
  const avatarVideos = [
    {
      id: 'intro-platform',
      title: 'Platform Introduction',
      description: 'Welcome and overview of the EdPsych Connect platform',
      avatarId: 'guide',
      category: 'Introduction'
    },
    {
      id: 'student-portal',
      title: 'Student Portal Guide',
      description: 'Navigation of student features and personalized learning tools',
      avatarId: 'student',
      category: 'Navigation'
    },
    {
      id: 'educator-resources',
      title: 'Educator Resources Guide',
      description: 'Navigation of educator features and teaching resources',
      avatarId: 'teacher',
      category: 'Navigation'
    },
    {
      id: 'learning-styles',
      title: 'Learning Styles Introduction',
      description: 'Overview of learning style adaptation and personalization',
      avatarId: 'professor',
      category: 'Educational'
    },
    {
      id: 'emotional-wellbeing',
      title: 'Emotional Wellbeing Tools Guide',
      description: 'Navigation of wellbeing resources and support tools',
      avatarId: 'counselor',
      category: 'Wellbeing'
    },
    {
      id: 'executive-function',
      title: 'Executive Function Support Guide',
      description: 'Navigation of organization tools and planning resources',
      avatarId: 'therapist',
      category: 'Support'
    },
    {
      id: 'restorative-justice',
      title: 'Restorative Justice Introduction',
      description: 'Overview of restorative practices in educational settings',
      avatarId: 'mediator',
      category: 'Educational'
    },
    {
      id: 'special-needs',
      title: 'Special Needs Support Introduction',
      description: 'Overview of accessibility features and support resources',
      avatarId: 'specialist',
      category: 'Support'
    },
    {
      id: 'adaptive-learning',
      title: 'Adaptive Learning Introduction',
      description: 'Overview of personalized learning pathways',
      avatarId: 'guide',
      category: 'Educational'
    },
    {
      id: 'voice-input',
      title: 'Voice Input Tutorial',
      description: 'How to use voice input features across the platform',
      avatarId: 'tech',
      category: 'Tutorial'
    },
    {
      id: 'age-group',
      title: 'Age Group Selection Guide',
      description: 'How to select appropriate age content and resources',
      avatarId: 'guide',
      category: 'Navigation'
    },
    {
      id: 'parent-portal',
      title: 'Parent Portal Introduction',
      description: 'Overview of resources for parents and guardians',
      avatarId: 'parent',
      category: 'Introduction'
    },
    {
      id: 'assessment-tools',
      title: 'Assessment Tools Guide',
      description: 'Navigation of evaluation resources and progress tracking',
      avatarId: 'teacher',
      category: 'Tutorial'
    },
    {
      id: 'professional-development',
      title: 'Professional Development Introduction',
      description: 'Overview of continuing education for educators',
      avatarId: 'professor',
      category: 'Educational'
    },
    {
      id: 'uk-curriculum',
      title: 'UK Curriculum Alignment',
      description: 'Overview of how resources align with UK curriculum standards',
      avatarId: 'specialist',
      category: 'Educational'
    },
    {
      id: 'community-features',
      title: 'Community Features Guide',
      description: 'Navigation of collaboration tools and community resources',
      avatarId: 'mediator',
      category: 'Navigation'
    },
    {
      id: 'accessibility-features',
      title: 'Accessibility Features Tutorial',
      description: 'How to use accessibility options throughout the platform',
      avatarId: 'tech',
      category: 'Tutorial'
    },
    {
      id: 'getting-help',
      title: 'Getting Help Guide',
      description: 'How to find support resources and contact assistance',
      avatarId: 'guide',
      category: 'Support'
    }
  ];

  // Group videos by category
  const videosByCategory = avatarVideos.reduce((acc, video) => {
    if (!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category].push(video);
    return acc;
  }, {});

  // Get unique categories
  const categories = Object.keys(videosByCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Avatar Video Library - EdPsych Connect</title>
        <meta name="description" content="Access our library of 18 educational avatar videos to help you navigate the EdPsych Connect platform and learn about key features." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6 text-gradient">Avatar Video Library</h1>
              <p className="text-lg mb-8">
                Access our library of 18 educational avatar videos to help you navigate the platform and learn about key features.
              </p>
              <Link href="/" className="btn-primary">
                Return to Homepage
              </Link>
            </div>
          </div>
        </section>

        {/* Video Library */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            {categories.map((category, index) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-gradient">{category} Videos</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videosByCategory[category].map((video) => (
                    <div 
                      key={video.id} 
                      className="bg-gray-50 rounded-lg shadow-md overflow-hidden animate-fade-in"
                      style={{animationDelay: `${0.1 * index}s`}}
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <Avatar 
                            avatarId={video.avatarId}
                            size="small"
                            className="mr-4"
                          />
                          <h3 className="text-xl font-semibold">{video.title}</h3>
                        </div>
                        <p className="mb-6 text-gray-600">{video.description}</p>
                        <Link 
                          href={`/avatar-video/${video.id}`}
                          className="btn-secondary inline-flex items-center"
                        >
                          Watch Video
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Video */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">Featured Video</h2>
              <AvatarVideoPlayer
                videoId="intro-platform"
                title="Platform Introduction"
                description="Welcome and overview of the EdPsych Connect platform designed by educational psychologists to provide personalised learning experiences for all students."
                avatarId="guide"
                autoPlay={false}
                controls={true}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
