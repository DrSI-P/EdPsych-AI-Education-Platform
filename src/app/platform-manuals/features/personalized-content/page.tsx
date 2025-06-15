import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  BookOpen, 
  Layers, 
  Brain, 
  Users, 
  BarChart, 
  Sliders,
  FileText,
  ChevronRight
} from 'lucide-react';
// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";




export const metadata: Metadata = {
  title: 'Personalized Content | EdPsych AI Platform',
  description: 'Learn how to use the personalized content features of the EdPsych AI Platform to create adaptive learning experiences.',
};

export default function PersonalizedContentGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/platform-manuals/features" className="text-blue-600 hover:text-blue-800 flex items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          Back to Features
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <Layers className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Personalized Content</h1>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            The EdPsych AI Platform&apos;s Personalized Content feature adapts learning materials to individual 
            student needs, preferences, and learning styles. This guide explains how to leverage our 
            AI-driven content personalisation to enhance learning outcomes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-xl font-medium text-gray-800">Learning Style Adaptation</h3>
              </div>
              <p className="text-gray-700">
                Content automatically adapts to visual, auditory, reading/writing, or kinaesthetic learning preferences.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Sliders className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-xl font-medium text-gray-800">Difficulty Scaling</h3>
              </div>
              <p className="text-gray-700">
                Automatically adjusts content complexity based on student performance and confidence levels.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-xl font-medium text-gray-800">Interest-Based Examples</h3>
              </div>
              <p className="text-gray-700">
                Incorporates student interests and cultural contexts to create relevant, engaging examples.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-xl font-medium text-gray-800">Progress-Based Pacing</h3>
              </div>
              <p className="text-gray-700">
                Adjusts content delivery speed and review frequency based on mastery and retention data.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How Personalisation Works</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-3">The Personalisation Process</h3>
            
            <ol className="list-decimal pl-6 space-y-4 text-gray-700">
              <li>
                <strong>Data Collection:</strong> The system gathers information through:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Initial learning style assessments</li>
                  <li>Ongoing performance monitoring</li>
                  <li>Engagement patterns and time-on-task metrics</li>
                  <li>Explicit student preferences and interests</li>
                </ul>
              </li>
              
              <li>
                <strong>AI Analysis:</strong> Our algorithms process this data to identify:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Optimal content formats for each learner</li>
                  <li>Knowledge gaps and misconceptions</li>
                  <li>Ideal challenge levels to maintain flow state</li>
                  <li>Effective examples and contexts that resonate</li>
                </ul>
              </li>
              
              <li>
                <strong>Content Transformation:</strong> The platform then:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Reformats existing content to match learning preferences</li>
                  <li>Adjusts complexity while maintaining curriculum alignment</li>
                  <li>Incorporates personalized examples and scenarios</li>
                  <li>Creates custom practice opportunities targeting specific needs</li>
                </ul>
              </li>
              
              <li>
                <strong>Continuous Refinement:</strong> The system constantly:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Evaluates the effectiveness of personalisation strategies</li>
                  <li>Adjusts approaches based on changing student needs</li>
                  <li>Incorporates new insights from learning science research</li>
                  <li>Builds increasingly accurate student learning profiles</li>
                </ul>
              </li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Setting Up Personalized Content</h2>

          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-medium text-gray-800 mb-2">For Educators</h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Navigate to your course or lesson in the Content Management section</li>
                <li>Enable the &quot;Personalisation&quot; toggle in the settings panel</li>
                <li>Select which personalisation dimensions to include:
                  <ul className="list-disc pl-6 mt-1 space-y-1">
                    <li>Learning style adaptation</li>
                    <li>Difficulty scaling</li>
                    <li>Interest-based examples</li>
                    <li>Progress-based pacing</li>
                  </ul>
                </li>
                <li>Set any constraints or requirements (e.g., essential content that must be included)</li>
                <li>Preview sample personalized versions for different student profiles</li>
                <li>Publish the content to make it available to students</li>
              </ol>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-medium text-gray-800 mb-2">For Students</h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Complete the initial learning style assessment (if not already done)</li>
                <li>Update your interests and preferences in your student profile</li>
                <li>Access personalized content through your regular course materials</li>
                <li>Provide feedback on personalisation effectiveness using the thumbs up/down buttons</li>
                <li>Adjust personalisation settings in your learning preferences panel if desired</li>
              </ol>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-medium text-gray-800 mb-2">For Administrators</h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Configure institution-wide personalisation defaults in the Admin Dashboard</li>
                <li>Set data collection and privacy policies for personalisation features</li>
                <li>Review personalisation analytics to assess effectiveness across courses</li>
                <li>Manage content transformation resources and processing priorities</li>
              </ol>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Advanced Personalisation Features</h2>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Multi-Modal Content Transformation</h3>
              <p className="text-gray-700 mb-2">
                For students with strong preferences or specific learning needs, content can be transformed into entirely different formats:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Text-to-visual concept maps for visual learners</li>
                <li>Text-to-speech with adjustable speed for auditory learners</li>
                <li>Interactive simulations for kinaesthetic learners</li>
                <li>Structured note templates for reading/writing learners</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded-lg mt-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Multi-modal transformations require additional processing time. 
                  Schedule these transformations at least 24 hours before students will access the content.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Accessibility-Driven Personalisation</h3>
              <p className="text-gray-700 mb-2">
                Beyond learning preferences, content can be automatically adapted for various accessibility needs:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Screen reader optimization with enhanced semantic structure</li>
                <li>Color contrast adjustments for visual impairments</li>
                <li>Simplified language options for English language learners</li>
                <li>Reduced cognitive load versions for attention difficulties</li>
                <li>Alternative navigation patterns for motor skill challenges</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Collaborative Personalisation</h3>
              <p className="text-gray-700 mb-2">
                For group activities, the system can create personalized roles and contributions:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Assigning tasks based on individual strengths</li>
                <li>Providing differentiated support materials to each group member</li>
                <li>Suggesting optimal group compositions based on complementary learning styles</li>
                <li>Adapting collaborative workflows to accommodate diverse needs</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Monitoring and Analytics</h2>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-3">Personalisation Insights Dashboard</h3>
            
            <p className="text-gray-700 mb-4">
              The Personalisation Insights Dashboard provides valuable data on how content adaptation 
              is affecting learning outcomes:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-800 mb-2">For Individual Students</h4>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  <li>Most effective content formats</li>
                  <li>Engagement patterns across different personalisation types</li>
                  <li>Performance improvements from personalisation</li>
                  <li>Recommended personalisation adjustments</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-800 mb-2">For Classes/Groups</h4>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  <li>Distribution of learning preferences</li>
                  <li>Comparative effectiveness of personalisation strategies</li>
                  <li>Content areas benefiting most from personalisation</li>
                  <li>Group-level personalisation recommendations</li>
                </ul>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm">
              Access the dashboard by navigating to Analytics &gt; Personalisation Insights in the main navigation.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Best Practices</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Balance Personalisation with Common Experiences</h3>
              <p className="text-gray-700">
                While personalisation improves engagement, maintain some shared learning experiences to facilitate class discussions and collaborative activities. Use the &quot;Core Content&quot; feature to designate material that all students will see in the same format.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Start Simple and Expand</h3>
              <p className="text-gray-700">
                Begin with one dimension of personalisation (e.g., learning style adaptation) and add others as you become comfortable with the system. This gradual approach helps both educators and students adjust to personalized learning.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Review and Refine</h3>
              <p className="text-gray-700">
                Regularly check the Personalisation Insights Dashboard to see which strategies are most effective for your students. Use this data to refine your approach and adjust settings as needed.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Explain the Process to Students</h3>
              <p className="text-gray-700">
                Help students understand how and why content is being personalized. This metacognitive awareness can enhance their engagement with the system and encourage them to provide more accurate preference data.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Troubleshooting</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Content Not Personalising</h3>
              <p className="text-gray-700">
                If content isn&apos;t adapting as expected:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Verify that personalisation is enabled for the specific content</li>
                <li>Check that student profiles include learning style assessment data</li>
                <li>Ensure the content type supports the selected personalisation dimensions</li>
                <li>Allow 24 hours for complex personalisation processing to complete</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Inappropriate Personalisation</h3>
              <p className="text-gray-700">
                If personalisation seems inappropriate or ineffective:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Review student profile data for accuracy</li>
                <li>Encourage students to provide feedback using the rating system</li>
                <li>Manually override specific personalisation settings if needed</li>
                <li>Consider resetting the learning profile if it seems to contain inaccurate data</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">System Performance Issues</h3>
              <p className="text-gray-700">
                If personalisation is causing system slowdowns:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Reduce the number of simultaneous personalisation dimensions</li>
                <li>Schedule intensive transformations during off-peak hours</li>
                <li>Consider upgrading your subscription for additional processing capacity</li>
                <li>Contact support if performance issues persist</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Live Personalisation Demo</h2>
            <p className="text-gray-700 mb-4">
              Experience how content adapts to different learning profiles:
            </p>
            
            {/* Learning Profile Selector */}
            <div className="bg-white p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-800 mb-3">Select a Learning Profile:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className="p-3 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition text-left">
                  <h4 className="font-medium text-gray-800">Visual Learner - Sarah</h4>
                  <p className="text-sm text-gray-600">Prefers diagrams, charts, and visual representations</p>
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50 transition text-left">
                  <h4 className="font-medium text-gray-800">Auditory Learner - James</h4>
                  <p className="text-sm text-gray-600">Learns best through listening and discussion</p>
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50 transition text-left">
                  <h4 className="font-medium text-gray-800">Kinesthetic Learner - Maya</h4>
                  <p className="text-sm text-gray-600">Prefers hands-on activities and movement</p>
                </button>
                <button className="p-3 border rounded-lg hover:bg-gray-50 transition text-left">
                  <h4 className="font-medium text-gray-800">Reading/Writing - Alex</h4>
                  <p className="text-sm text-gray-600">Excels with text-based materials and note-taking</p>
                </button>
              </div>
            </div>
            
            {/* Personalized Content Example */}
            <div className="bg-white p-6 rounded-lg shadow-inner">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Topic: The Water Cycle (Personalized for Visual Learner)
              </h3>
              
              {/* Visual Learning Content */}
              <div className="space-y-4">
                {/* Interactive Diagram */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="aspect-video bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg relative overflow-hidden">
                    {/* Sun */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center">
                      <span className="text-2xl">☀️</span>
                    </div>
                    
                    {/* Clouds */}
                    <div className="absolute top-8 left-1/4 bg-white rounded-full opacity-90 px-6 py-3 shadow">
                      <span className="text-sm font-medium">Condensation</span>
                    </div>
                    <div className="absolute top-16 left-1/2 bg-gray-200 rounded-full opacity-90 px-6 py-3 shadow">
                      <span className="text-sm font-medium">Precipitation</span>
                    </div>
                    
                    {/* Ocean */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-blue-500 opacity-70">
                      <div className="absolute top-2 left-1/4 bg-white rounded px-3 py-1">
                        <span className="text-sm font-medium">Evaporation</span>
                      </div>
                    </div>
                    
                    {/* Arrows showing cycle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-blue-600 text-6xl opacity-20">↻</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Interactive diagram: Click on each stage to learn more
                  </p>
                </div>
                
                {/* Key Concepts with Icons */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg flex items-start">
                    <span className="text-2xl mr-3">💧</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Evaporation</h4>
                      <p className="text-sm text-gray-600">Water turns into vapor</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex items-start">
                    <span className="text-2xl mr-3">☁️</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Condensation</h4>
                      <p className="text-sm text-gray-600">Vapor forms clouds</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg flex items-start">
                    <span className="text-2xl mr-3">🌧️</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Precipitation</h4>
                      <p className="text-sm text-gray-600">Water falls as rain</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg flex items-start">
                    <span className="text-2xl mr-3">🏞️</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Collection</h4>
                      <p className="text-sm text-gray-600">Water gathers in bodies</p>
                    </div>
                  </div>
                </div>
                
                {/* Visual Memory Aid */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Visual Memory Technique</h4>
                  <p className="text-sm text-gray-700">
                    Remember the water cycle with this visual story: The <strong>sun (☀️)</strong> helps water
                    <strong> rise up (↑)</strong> to form <strong>clouds (☁️)</strong>, which get heavy and
                    <strong> drop rain (🌧️)</strong> that <strong>flows back (↻)</strong> to the ocean.
                  </p>
                </div>
              </div>
              
              {/* Personalisation Indicators */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">Personalized for: Visual Learning Style</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="text-blue-600 hover:text-blue-800">Try Another Style</button>
                    <button className="text-gray-600 hover:text-gray-800">Adjust Preferences</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Real-Time Adaptation Examples</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-3">Difficulty Adjustment</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-green-500">
                  <p className="text-sm font-medium text-gray-800">Basic Level</p>
                  <p className="text-sm text-gray-600">Water goes up, forms clouds, falls as rain</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
                  <p className="text-sm font-medium text-gray-800">Intermediate Level</p>
                  <p className="text-sm text-gray-600">Evaporation, condensation, precipitation, collection</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-red-500">
                  <p className="text-sm font-medium text-gray-800">Advanced Level</p>
                  <p className="text-sm text-gray-600">Includes transpiration, sublimation, and atmospheric pressure effects</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-gray-800 mb-3">Interest-Based Examples</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded flex items-center">
                  <span className="text-2xl mr-3">⚽</span>
                  <p className="text-sm text-gray-700">
                    <strong>Sports Fan:</strong> Like how sweat evaporates to cool athletes...
                  </p>
                </div>
                <div className="bg-white p-3 rounded flex items-center">
                  <span className="text-2xl mr-3">🎮</span>
                  <p className="text-sm text-gray-700">
                    <strong>Gamer:</strong> Similar to the weather systems in Minecraft...
                  </p>
                </div>
                <div className="bg-white p-3 rounded flex items-center">
                  <span className="text-2xl mr-3">🎵</span>
                  <p className="text-sm text-gray-700">
                    <strong>Music Lover:</strong> Think of it like a natural rhythm or cycle...
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-600 text-sm">
              For additional support with personalized content features, please contact our support team or visit the Help Center.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/platform-manuals/features/ai-lesson-planning" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
        >
          <Brain className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="font-semibold text-gray-800">AI Lesson Planning</h3>
            <p className="text-gray-600 text-sm">Create personalized lesson plans with AI assistance</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
        </Link>
        
        <Link 
          href="/platform-manuals/features/interactive-video" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center"
        >
          <FileText className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="font-semibold text-gray-800">Interactive Video</h3>
            <p className="text-gray-600 text-sm">Enhance learning with interactive video features</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}