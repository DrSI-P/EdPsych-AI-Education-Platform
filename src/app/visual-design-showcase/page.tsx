'use client';

import React, { useState, useEffect } from 'react';
import { VisualCard } from '@/components/ui/visual-card';
import { VisualLearningContainer } from '@/components/ui/visual-learning-container';
import { SubjectIcon } from '@/components/ui/subject-icon';
import { ProgressVisualization } from '@/components/ui/progress-visualization';
import { ConceptMap } from '@/components/ui/concept-map';
import { LearningModuleCard } from '@/components/ui/learning-module-card';
import { VisualLearningPath } from '@/components/ui/visual-learning-path';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function VisualDesignShowcase() {
  const [activeKeyStage, setActiveKeyStage] = useState<'eyfs' | 'ks1' | 'ks2' | 'ks3' | 'ks4'>('ks2');
  const [demoProgress, setDemoProgress] = useState(45);
  
  // Increment progress for demo purposes
  useEffect(() => {
    const timer = setInterval(() => {
      setDemoProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Sample concept map data
  const conceptMapNodes = [
    { id: 'n1', label: 'Photosynthesis', x: 50, y: 20, type: 'primary', subject: 'science' },
    { id: 'n2', label: 'Sunlight', x: 20, y: 40, type: 'secondary' },
    { id: 'n3', label: 'Water', x: 40, y: 60, type: 'secondary' },
    { id: 'n4', label: 'Carbon Dioxide', x: 60, y: 60, type: 'secondary' },
    { id: 'n5', label: 'Oxygen', x: 80, y: 40, type: 'tertiary' },
    { id: 'n6', label: 'Glucose', x: 50, y: 80, type: 'tertiary' },
  ];
  
  const conceptMapConnections = [
    { from: 'n1', to: 'n2', label: 'requires', direction: 'one-way' },
    { from: 'n1', to: 'n3', label: 'requires', direction: 'one-way' },
    { from: 'n1', to: 'n4', label: 'requires', direction: 'one-way' },
    { from: 'n1', to: 'n5', label: 'produces', direction: 'one-way' },
    { from: 'n1', to: 'n6', label: 'produces', direction: 'one-way' },
  ];
  
  // Sample learning path steps
  const learningPathSteps = [
    { 
      title: 'Introduction', 
      description: 'Overview of the topic', 
      status: 'completed' 
    },
    { 
      title: 'Key Concepts', 
      description: 'Understanding fundamental principles', 
      status: 'completed' 
    },
    { 
      title: 'Practical Application', 
      description: 'Applying knowledge to real scenarios', 
      status: 'current' 
    },
    { 
      title: 'Assessment', 
      description: 'Test your understanding', 
      status: 'upcoming' 
    },
    { 
      title: 'Extension', 
      description: 'Advanced concepts and further learning', 
      status: 'upcoming' 
    }
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Visual Design Showcase</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Demonstrating the enhanced visual design components for visual learners
      </p>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Key Stage Adaptation</h2>
        <p className="mb-4">
          Select a key stage to see how the visual design adapts to different age groups:
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeKeyStage === 'eyfs' ? 'default' : 'outline'}
            onClick={() => setActiveKeyStage('eyfs')}
          >
            EYFS
          </Button>
          <Button 
            variant={activeKeyStage === 'ks1' ? 'default' : 'outline'}
            onClick={() => setActiveKeyStage('ks1')}
          >
            Key Stage 1
          </Button>
          <Button 
            variant={activeKeyStage === 'ks2' ? 'default' : 'outline'}
            onClick={() => setActiveKeyStage('ks2')}
          >
            Key Stage 2
          </Button>
          <Button 
            variant={activeKeyStage === 'ks3' ? 'default' : 'outline'}
            onClick={() => setActiveKeyStage('ks3')}
          >
            Key Stage 3
          </Button>
          <Button 
            variant={activeKeyStage === 'ks4' ? 'default' : 'outline'}
            onClick={() => setActiveKeyStage('ks4')}
          >
            Key Stage 4
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="components" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components">UI Components</TabsTrigger>
          <TabsTrigger value="learning">Learning Elements</TabsTrigger>
          <TabsTrigger value="subjects">Subject Styling</TabsTrigger>
        </TabsList>
        
        <TabsContent value="components" className="space-y-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-4">Visual Cards</h3>
              <VisualCard 
                title="Visual Card Example" 
                description="Cards designed for visual impact and clarity"
                keyStage={activeKeyStage}
              >
                <p className="mb-4">
                  Visual cards provide a consistent container for content with appropriate styling for different age groups.
                </p>
                <Button>Interactive Element</Button>
              </VisualCard>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Visual Learning Containers</h3>
              <VisualLearningContainer
                title="Learning Container"
                description="Focused content presentation for visual learners"
                highlight={true}
              >
                <p>
                  Learning containers provide a focused environment for content, with optional highlighting to draw attention to important information.
                </p>
              </VisualLearningContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Progress Visualization</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProgressVisualization 
                progress={demoProgress} 
                showLabel={true}
                label="Small Progress"
                size="sm"
              />
              <ProgressVisualization 
                progress={demoProgress} 
                showLabel={true}
                label="Medium Progress"
                size="md"
              />
              <ProgressVisualization 
                progress={demoProgress} 
                showLabel={true}
                label="Large Progress"
                size="lg"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Subject Icons</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-center">
                <SubjectIcon subject="maths" size="lg" />
                <span className="mt-2 text-sm">Maths</span>
              </div>
              <div className="flex flex-col items-center">
                <SubjectIcon subject="english" size="lg" />
                <span className="mt-2 text-sm">English</span>
              </div>
              <div className="flex flex-col items-center">
                <SubjectIcon subject="science" size="lg" />
                <span className="mt-2 text-sm">Science</span>
              </div>
              <div className="flex flex-col items-center">
                <SubjectIcon subject="history" size="lg" />
                <span className="mt-2 text-sm">History</span>
              </div>
              <div className="flex flex-col items-center">
                <SubjectIcon subject="geography" size="lg" />
                <span className="mt-2 text-sm">Geography</span>
              </div>
              <div className="flex flex-col items-center">
                <SubjectIcon subject="art" size="lg" />
                <span className="mt-2 text-sm">Art</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="learning" className="space-y-8 pt-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Learning Module Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LearningModuleCard
                title="Fractions and Decimals"
                description="Learn to convert between fractions and decimals"
                subject="maths"
                keyStage={activeKeyStage}
                progress={75}
                estimatedTime="30 mins"
                difficulty="intermediate"
                tags={["Fractions", "Decimals", "Conversion"]}
              />
              
              <LearningModuleCard
                title="Creative Writing"
                description="Develop descriptive writing techniques"
                subject="english"
                keyStage={activeKeyStage}
                progress={45}
                estimatedTime="45 mins"
                difficulty="beginner"
                tags={["Descriptive", "Narrative", "Vocabulary"]}
              />
              
              <LearningModuleCard
                title="Photosynthesis"
                description="Understanding how plants make food"
                subject="science"
                keyStage={activeKeyStage}
                progress={20}
                estimatedTime="60 mins"
                difficulty="advanced"
                tags={["Biology", "Plants", "Energy"]}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Concept Maps</h3>
            <ConceptMap
              title="Photosynthesis Process"
              description="Visual representation of the photosynthesis process"
              nodes={conceptMapNodes}
              connections={conceptMapConnections}
              keyStage={activeKeyStage}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Visual Learning Paths</h3>
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">Vertical Learning Path</h4>
              <VisualLearningPath
                steps={learningPathSteps}
                orientation="vertical"
                keyStage={activeKeyStage}
              />
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-2">Horizontal Learning Path</h4>
              <VisualLearningPath
                steps={learningPathSteps}
                orientation="horizontal"
                keyStage={activeKeyStage}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subjects" className="space-y-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VisualCard 
              title="Mathematics" 
              description="Number and calculation concepts"
              subject="maths"
              keyStage={activeKeyStage}
            >
              <p>Subject-specific styling for mathematics content.</p>
            </VisualCard>
            
            <VisualCard 
              title="English" 
              description="Language and literature"
              subject="english"
              keyStage={activeKeyStage}
            >
              <p>Subject-specific styling for English content.</p>
            </VisualCard>
            
            <VisualCard 
              title="Science" 
              description="Scientific principles and experiments"
              subject="science"
              keyStage={activeKeyStage}
            >
              <p>Subject-specific styling for science content.</p>
            </VisualCard>
            
            <VisualCard 
              title="History" 
              description="Past events and their significance"
              subject="history"
              keyStage={activeKeyStage}
            >
              <p>Subject-specific styling for history content.</p>
            </VisualCard>
            
            <VisualCard 
              title="Geography" 
              description="Places, environments, and people"
              subject="geography"
              keyStage={activeKeyStage}
            >
              <p>Subject-specific styling for geography content.</p>
            </VisualCard>
            
            <VisualCard 
              title="Art" 
              description="Creative expression and techniques"
              subject="art"
              keyStage={activeKeyStage}
            >
              <p>Subject-specific styling for art content.</p>
            </VisualCard>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Design System Implementation</h2>
        <p className="mb-4">
          The visual design enhancements are built on a comprehensive design system that includes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Age-appropriate theme variations for different key stages</li>
          <li>Subject-specific color coding for visual recognition</li>
          <li>Consistent spacing, typography, and visual hierarchy</li>
          <li>Accessibility features including dark mode and high contrast options</li>
          <li>Responsive design for all screen sizes</li>
          <li>Interactive elements with appropriate visual feedback</li>
        </ul>
      </div>
    </div>
  );
}
