import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Layers, ArrowLeft, Brain, Users, Sliders, BarChart } from 'lucide-react';
import Image from 'next/image';
// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';
// Disable static generation
export const revalidate = 3600; // 1 hour // 1 hour
// Disable fetch caching
export const fetchCache = "force-no-store";




export const metadata: Metadata = {
  title: 'Personalized Content Demo | EdPsych AI Platform',
  description: 'Experience the personalized content features of the EdPsych AI Platform in action.',
};

export default function PersonalizedContentDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <Link href="/platform-manuals/features/personalized-content" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Personalized Content Guide
        </Link>
        <Link href="/platform-manuals/features" className="text-blue-600 hover:text-blue-800 flex items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          All Features
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <Layers className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Personalized Content Demo</h1>
        </div>

        <div className="prose max-w-none mb-8">
          <p className="text-lg text-gray-700">
            This demonstration showcases how the EdPsych AI Platform adapts content to different learning 
            styles, preferences, and needs. Explore how the same educational material transforms to 
            provide an optimal learning experience for each student.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Learning Style Adaptation</h2>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">Original Content: Photosynthesis Lesson</h3>
            </div>
            <div className="p-4 bg-white">
              <p className="text-gray-700 mb-4">
                Photosynthesis is the process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.
              </p>
              <p className="text-gray-700">
                The process can be summarized by the equation: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center">
                <Brain className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-gray-800">Visual Learner Adaptation</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-center">
                  <div className="relative w-full h-64">
                    <Image 
                      src="/images/platform-manuals/personalized-content/photosynthesis-diagram.jpg" 
                      alt="Visual diagram of photosynthesis process"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-2 mr-2 mt-1">
                      <span className="text-green-800 font-bold text-sm">1</span>
                    </div>
                    <p className="text-gray-700 text-sm">Sunlight is absorbed by chlorophyll in plant leaves</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-2 mt-1">
                      <span className="text-blue-800 font-bold text-sm">2</span>
                    </div>
                    <p className="text-gray-700 text-sm">Water (H₂O) from soil enters through roots</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-2 mr-2 mt-1">
                      <span className="text-gray-800 font-bold text-sm">3</span>
                    </div>
                    <p className="text-gray-700 text-sm">Carbon dioxide (CO₂) enters through leaf stomata</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-100 rounded-full p-2 mr-2 mt-1">
                      <span className="text-yellow-800 font-bold text-sm">4</span>
                    </div>
                    <p className="text-gray-700 text-sm">Chemical reaction produces glucose (C₆H₁₂O₆) and oxygen (O₂)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-gray-800">Kinaesthetic Learner Adaptation</h3>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-medium text-gray-800 mb-2">Interactive Simulation Activity</h4>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="relative w-full h-40">
                    <Image 
                      src="/images/platform-manuals/personalized-content/photosynthesis-simulation.jpg" 
                      alt="Interactive photosynthesis simulation"
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Drag and drop the elements to simulate photosynthesis:
                </p>
                <ol className="list-decimal pl-5 text-gray-700 text-sm space-y-2">
                  <li>Position the sun to direct light energy to the leaf</li>
                  <li>Move water molecules from the roots up through the stem</li>
                  <li>Direct carbon dioxide molecules into the leaf stomata</li>
                  <li>Observe glucose production and oxygen release</li>
                  <li>Adjust light intensity to see effects on the rate of photosynthesis</li>
                </ol>
                <div className="mt-3 text-sm text-gray-500 italic">
                  * In the actual platform, this would be a fully interactive simulation
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center">
                <BarChart className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-gray-800">Reading/Writing Learner Adaptation</h3>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-medium text-gray-800 mb-2">Structured Notes Template</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-700 text-sm">Definition:</h5>
                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                      <p className="text-gray-700 text-sm">Photosynthesis is the process by which plants convert ________ energy into ________ energy.</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 text-sm">Chemical Equation:</h5>
                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                      <p className="text-gray-700 text-sm">______ + ______ + Light Energy → ______ + ______</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 text-sm">Key Components:</h5>
                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                      <ol className="list-decimal pl-5 text-gray-700 text-sm space-y-1">
                        <li>Inputs: ________, ________, and ________</li>
                        <li>Outputs: ________ and ________</li>
                        <li>Location in plant: ________</li>
                        <li>Pigment required: ________</li>
                      </ol>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 text-sm">Importance:</h5>
                    <div className="border border-gray-200 rounded p-2 bg-gray-50 min-h-[60px]">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center">
                <Sliders className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-gray-800">Auditory Learner Adaptation</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center">
                  <div className="relative w-full h-40">
                    <Image 
                      src="/images/platform-manuals/personalized-content/audio-player.jpg" 
                      alt="Audio explanation of photosynthesis"
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Audio Explanation with Key Points</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full h-2 w-2 mr-2"></div>
                    <p className="text-gray-700 text-sm">"Photosynthesis is like a plant's kitchen..."</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full h-2 w-2 mr-2"></div>
                    <p className="text-gray-700 text-sm">"The ingredients are carbon dioxide and water..."</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full h-2 w-2 mr-2"></div>
                    <p className="text-gray-700 text-sm">"Sunlight provides the energy to cook..."</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full h-2 w-2 mr-2"></div>
                    <p className="text-gray-700 text-sm">"The recipe creates glucose and oxygen..."</p>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-500 italic">
                  * In the actual platform, this would include a full audio narration with interactive transcript
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Difficulty Scaling</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Foundation Level</h3>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-medium text-gray-800 mb-2">Basic Concept</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Plants make their own food using sunlight, water, and air. This process is called photosynthesis.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  During photosynthesis:
                </p>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1 mb-3">
                  <li>Plants take in water from the soil</li>
                  <li>Plants take in carbon dioxide from the air</li>
                  <li>Sunlight gives energy to the plant</li>
                  <li>Plants make food (sugar) and oxygen</li>
                </ul>
                <p className="text-gray-700 text-sm">
                  The oxygen is released into the air for us to breathe.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-yellow-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Intermediate Level</h3>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-medium text-gray-800 mb-2">Expanded Explanation</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Photosynthesis is the process plants use to convert light energy into chemical energy stored as glucose.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  The process occurs in the chloroplasts, specifically in the chlorophyll pigments that give plants their green color.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  The basic equation is:
                </p>
                <div className="bg-gray-50 p-2 rounded text-center mb-3">
                  <p className="text-gray-700 text-sm font-medium">
                    6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
                  </p>
                </div>
                <p className="text-gray-700 text-sm">
                  This means six molecules of carbon dioxide plus six molecules of water, combined with light energy, produce one glucose molecule and six oxygen molecules.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-red-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Advanced Level</h3>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-medium text-gray-800 mb-2">Detailed Analysis</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Photosynthesis occurs in two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions).
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  In the light-dependent reactions:
                </p>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1 mb-3">
                  <li>Photosystems II and I capture light energy</li>
                  <li>Water molecules are split (photolysis), releasing O₂</li>
                  <li>Electrons flow through the electron transport chain</li>
                  <li>ATP and NADPH are produced as energy carriers</li>
                </ul>
                <p className="text-gray-700 text-sm mb-3">
                  In the Calvin cycle:
                </p>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1 mb-3">
                  <li>CO₂ is fixed by the enzyme RuBisCO</li>
                  <li>ATP and NADPH from the light reactions provide energy</li>
                  <li>3-carbon molecules are reduced to form G3P</li>
                  <li>G3P is used to synthesize glucose and regenerate RuBP</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Interest-Based Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Sports Enthusiast</h3>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-medium text-gray-800 mb-2">Photosynthesis & Athletic Performance</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Just as athletes need proper nutrition to perform, plants create their own "food" through photosynthesis.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  Think of photosynthesis like a training cycle:
                </p>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1 mb-3">
                  <li>Plants "breathe in" carbon dioxide (like you inhale oxygen during exercise)</li>
                  <li>Sunlight provides energy (like carbohydrates fuel your workouts)</li>
                  <li>Water is essential (just as hydration is crucial for athletes)</li>
                  <li>The process produces glucose (similar to how your body stores glycogen for energy)</li>
                  <li>Oxygen is released (which athletes then use during aerobic exercise)</li>
                </ul>
                <p className="text-gray-700 text-sm">
                  The oxygen produced by plants worldwide makes all athletic performance possible!
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Music Lover</h3>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-medium text-gray-800 mb-2">Photosynthesis as a Symphony</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Photosynthesis works like a well-orchestrated symphony with different sections playing their parts perfectly together.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  The components of this natural symphony include:
                </p>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1 mb-3">
                  <li>Sunlight acts as the conductor, directing the tempo and intensity</li>
                  <li>Chlorophyll molecules are like the string section, capturing light energy</li>
                  <li>Water molecules split apart like percussion instruments creating rhythm</li>
                  <li>Carbon dioxide molecules are transformed like notes changing through different movements</li>
                  <li>The Calvin cycle works as the recurring melody, repeating throughout the piece</li>
                  <li>Glucose production is the grand finale, the culmination of the entire performance</li>
                </ul>
                <p className="text-gray-700 text-sm">
                  Just as a symphony creates beautiful music from individual instruments, photosynthesis creates life-sustaining energy from simple molecules.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
              <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Gaming Enthusiast</h3>
              </div>
              <div className="p-4 bg-white">
                <h4 className="font-medium text-gray-800 mb-2">Photosynthesis: Nature's Resource Management Game</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Photosynthesis is like the ultimate resource management strategy game that plants have been playing for millions of years.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  Game mechanics of photosynthesis:
                </p>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1 mb-3">
                  <li><strong>Resources to collect:</strong> Sunlight energy, water, and carbon dioxide</li>
                  <li><strong>Base building:</strong> Creating chloroplasts and expanding leaf surface area</li>
                  <li><strong>Energy management:</strong> Converting light energy to chemical energy (ATP)</li>
                  <li><strong>Crafting system:</strong> Combining resources to create glucose</li>
                  <li><strong>Upgrade path:</strong> Using glucose to grow taller, produce flowers, and develop fruit</li>
                  <li><strong>Competitive strategy:</strong> Growing taller to access more sunlight than neighboring plants</li>
                  <li><strong>Environmental challenges:</strong> Adapting to drought, shade, or nutrient limitations</li>
                </ul>
                <p className="text-gray-700 text-sm">
                  Plants that manage their resources most efficiently win the evolutionary game by reproducing more successfully!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Demo Features</h2>
          <p className="text-gray-700 mb-4">
            This demonstration showcases the following personalisation capabilities:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Learning Style Adaptation:</strong> Content reformatted for visual, auditory, reading/writing, and kinaesthetic learners</li>
            <li><strong>Difficulty Scaling:</strong> Same concept presented at three different complexity levels</li>
            <li><strong>Interest-Based Examples:</strong> Content contextualized based on student interests</li>
            <li><strong>Multi-Modal Presentation:</strong> Information presented through text, diagrams, simulations, and audio</li>
            <li><strong>Structured Learning Scaffolds:</strong> Note templates, guided activities, and visual organizers</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Implementation Notes</h2>
          <p className="text-gray-700 mb-4">
            This demonstration uses the following components from the EdPsych AI Platform:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><code className="bg-gray-200 px-2 py-1 rounded text-sm">LearningStyleAdapter</code> - Transforms content based on learning preferences</li>
            <li><code className="bg-gray-200 px-2 py-1 rounded text-sm">DifficultyScaler</code> - Adjusts complexity while maintaining curriculum alignment</li>
            <li><code className="bg-gray-200 px-2 py-1 rounded text-sm">InterestContextualizer</code> - Creates relevant examples based on student interests</li>
            <li><code className="bg-gray-200 px-2 py-1 rounded text-sm">ContentTransformer</code> - Handles multi-modal content conversion</li>
          </ul>
          <p className="text-gray-700 mt-4">
            In a production environment, these transformations would be dynamically generated based on each student&apos;s 
            learning profile, which includes their assessed learning style, demonstrated mastery level, and stated interests.
          </p>
        </div>
      </div>
    </div>
  );
}