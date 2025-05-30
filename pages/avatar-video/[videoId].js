import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Avatar, AvatarVideoPlayer } from '../../src/components/Avatar';
import MainNavigation from '../../src/components/ui/MainNavigation';
import Footer from '../../src/components/layout/Footer';

export default function AvatarVideoPage() {
  const router = useRouter();
  const { videoId } = router.query;
  
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ageGroup, setAgeGroup] = useState('standard');
  const [relatedVideos, setRelatedVideos] = useState([]);

  // Mock data for all 18 strategic avatar videos
  const allVideos = [
    {
      id: 'intro-platform',
      title: 'Platform Introduction',
      description: 'Welcome and overview of the EdPsych Connect platform designed by educational psychologists to provide personalised learning experiences for all students.',
      avatarId: 'guide',
      category: 'Introduction',
      tags: ['welcome', 'overview', 'introduction'],
      nextVideoId: 'student-portal'
    },
    {
      id: 'student-portal',
      title: 'Student Portal Guide',
      description: 'Navigation of student features and personalized learning tools to support your unique learning journey.',
      avatarId: 'student',
      category: 'Navigation',
      tags: ['student', 'portal', 'navigation'],
      nextVideoId: 'educator-resources'
    },
    {
      id: 'educator-resources',
      title: 'Educator Resources Guide',
      description: 'Navigation of educator features and teaching resources to enhance your teaching practice.',
      avatarId: 'teacher',
      category: 'Navigation',
      tags: ['educator', 'resources', 'navigation'],
      nextVideoId: 'learning-styles'
    },
    {
      id: 'learning-styles',
      title: 'Learning Styles Introduction',
      description: 'Overview of learning style adaptation and personalization features to match your unique way of learning.',
      avatarId: 'professor',
      category: 'Educational',
      tags: ['learning', 'styles', 'adaptation'],
      nextVideoId: 'emotional-wellbeing'
    },
    {
      id: 'emotional-wellbeing',
      title: 'Emotional Wellbeing Tools Guide',
      description: 'Navigation of wellbeing resources and support tools to help maintain a healthy mindset for learning.',
      avatarId: 'counselor',
      category: 'Wellbeing',
      tags: ['emotional', 'wellbeing', 'mental health'],
      nextVideoId: 'executive-function'
    },
    {
      id: 'executive-function',
      title: 'Executive Function Support Guide',
      description: 'Navigation of organization tools and planning resources to help with time management and task completion.',
      avatarId: 'therapist',
      category: 'Support',
      tags: ['organization', 'planning', 'executive function'],
      nextVideoId: 'restorative-justice'
    },
    {
      id: 'restorative-justice',
      title: 'Restorative Justice Introduction',
      description: 'Overview of restorative practices in educational settings to build community and resolve conflicts.',
      avatarId: 'mediator',
      category: 'Educational',
      tags: ['restorative', 'justice', 'conflict resolution'],
      nextVideoId: 'special-needs'
    },
    {
      id: 'special-needs',
      title: 'Special Needs Support Introduction',
      description: 'Overview of accessibility features and support resources for diverse learning needs.',
      avatarId: 'specialist',
      category: 'Support',
      tags: ['special needs', 'accessibility', 'support'],
      nextVideoId: 'adaptive-learning'
    },
    {
      id: 'adaptive-learning',
      title: 'Adaptive Learning Introduction',
      description: 'Overview of personalized learning pathways that adjust to your progress and understanding.',
      avatarId: 'guide',
      category: 'Educational',
      tags: ['adaptive', 'personalized', 'learning'],
      nextVideoId: 'voice-input'
    },
    {
      id: 'voice-input',
      title: 'Voice Input Tutorial',
      description: 'How to use voice input features across the platform to support those who struggle with typing.',
      avatarId: 'tech',
      category: 'Tutorial',
      tags: ['voice', 'input', 'accessibility'],
      nextVideoId: 'age-group'
    },
    {
      id: 'age-group',
      title: 'Age Group Selection Guide',
      description: 'How to select appropriate age content and resources to ensure materials match developmental needs.',
      avatarId: 'guide',
      category: 'Navigation',
      tags: ['age', 'group', 'selection'],
      nextVideoId: 'parent-portal'
    },
    {
      id: 'parent-portal',
      title: 'Parent Portal Introduction',
      description: 'Overview of resources for parents and guardians to support their child\'s learning journey.',
      avatarId: 'parent',
      category: 'Introduction',
      tags: ['parent', 'guardian', 'support'],
      nextVideoId: 'assessment-tools'
    },
    {
      id: 'assessment-tools',
      title: 'Assessment Tools Guide',
      description: 'Navigation of evaluation resources and progress tracking to monitor learning development.',
      avatarId: 'teacher',
      category: 'Tutorial',
      tags: ['assessment', 'evaluation', 'progress'],
      nextVideoId: 'professional-development'
    },
    {
      id: 'professional-development',
      title: 'Professional Development Introduction',
      description: 'Overview of continuing education resources for educators to enhance teaching skills.',
      avatarId: 'professor',
      category: 'Educational',
      tags: ['professional', 'development', 'education'],
      nextVideoId: 'uk-curriculum'
    },
    {
      id: 'uk-curriculum',
      title: 'UK Curriculum Alignment',
      description: 'Overview of how resources align with UK curriculum standards to ensure educational relevance.',
      avatarId: 'specialist',
      category: 'Educational',
      tags: ['UK', 'curriculum', 'alignment'],
      nextVideoId: 'community-features'
    },
    {
      id: 'community-features',
      title: 'Community Features Guide',
      description: 'Navigation of collaboration tools and community resources to connect with others.',
      avatarId: 'mediator',
      category: 'Navigation',
      tags: ['community', 'collaboration', 'connection'],
      nextVideoId: 'accessibility-features'
    },
    {
      id: 'accessibility-features',
      title: 'Accessibility Features Tutorial',
      description: 'How to use accessibility options throughout the platform to ensure inclusive access for all.',
      avatarId: 'tech',
      category: 'Tutorial',
      tags: ['accessibility', 'inclusive', 'features'],
      nextVideoId: 'getting-help'
    },
    {
      id: 'getting-help',
      title: 'Getting Help Guide',
      description: 'How to find support resources and contact assistance when you need additional help.',
      avatarId: 'guide',
      category: 'Support',
      tags: ['help', 'support', 'assistance'],
      nextVideoId: 'intro-platform'
    }
  ];

  // Load video data when videoId changes
  useEffect(() => {
    if (!videoId) return;
    
    setIsLoading(true);
    
    // Find the video data from our mock data
    const video = allVideos.find(v => v.id === videoId);
    
    if (video) {
      setVideoData(video);
      
      // Find related videos (same category or matching tags)
      const related = allVideos
        .filter(v => v.id !== videoId && (
          v.category === video.category || 
          v.tags.some(tag => video.tags.includes(tag))
        ))
        .slice(0, 3); // Limit to 3 related videos
      
      setRelatedVideos(related);
      setIsLoading(false);
    } else {
      setError('Video not found');
      setIsLoading(false);
    }
  }, [videoId]);

  // Handle video completion
  const handleVideoComplete = () => {
    if (videoData && videoData.nextVideoId) {
      router.push(`/avatar-video/${videoData.nextVideoId}`);
    }
  };

  // Handle age group change
  const handleAgeGroupChange = (e) => {
    setAgeGroup(e.target.value);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNavigation />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNavigation />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <Link href="/avatar-library" className="block mt-4 text-red-700 underline">
              Return to Avatar Library
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // No video data
  if (!videoData) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNavigation />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Video Not Found</h1>
            <Link href="/avatar-library" className="btn-primary">
              Return to Avatar Library
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{videoData.title} - EdPsych Connect</title>
        <meta name="description" content={videoData.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainNavigation />

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link href="/" className="text-gray-700 hover:text-primary">
                      Home
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <Link href="/avatar-library" className="ml-1 text-gray-700 hover:text-primary md:ml-2">
                        Avatar Library
                      </Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="ml-1 text-gray-500 md:ml-2">{videoData.title}</span>
                    </div>
                  </li>
                </ol>
              </nav>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4 text-gradient">{videoData.title}</h1>
                
                {/* Age group selector */}
                <div className="mb-6">
                  <label htmlFor="age-group" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Age Group:
                  </label>
                  <select
                    id="age-group"
                    value={ageGroup}
                    onChange={handleAgeGroupChange}
                    className="w-full sm:w-auto p-2 border border-gray-300 rounded-md"
                  >
                    <option value="nursery">Nursery</option>
                    <option value="early-primary">Early Primary</option>
                    <option value="late-primary">Late Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                
                {/* Video player */}
                <AvatarVideoPlayer
                  videoId={videoData.id}
                  title={videoData.title}
                  description={videoData.description}
                  avatarId={videoData.avatarId}
                  ageGroup={ageGroup}
                  autoPlay={false}
                  controls={true}
                  onComplete={handleVideoComplete}
                  className="mb-8"
                />
                
                {/* Video metadata */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h2 className="text-lg font-semibold mb-2">About this video:</h2>
                  <p className="mb-4">{videoData.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {videoData.category}
                    </span>
                    {videoData.tags.map(tag => (
                      <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Navigation buttons */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <Link href="/avatar-library" className="btn-secondary">
                    Back to Library
                  </Link>
                  {videoData.nextVideoId && (
                    <Link href={`/avatar-video/${videoData.nextVideoId}`} className="btn-primary inline-flex items-center">
                      Next Video
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related videos */}
        {relatedVideos.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Related Videos</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedVideos.map((video) => (
                    <div 
                      key={video.id} 
                      className="bg-gray-50 rounded-lg shadow-md overflow-hidden animate-fade-in"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <Avatar 
                            avatarId={video.avatarId}
                            size="small"
                            className="mr-4"
                          />
                          <h3 className="text-lg font-semibold">{video.title}</h3>
                        </div>
                        <p className="mb-6 text-gray-600 text-sm">{video.description}</p>
                        <Link 
                          href={`/avatar-video/${video.id}`}
                          className="btn-secondary inline-flex items-center text-sm"
                        >
                          Watch Video
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
