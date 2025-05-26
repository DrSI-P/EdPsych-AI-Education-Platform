'use client';

import React, { useState, useEffect } from 'react';
// Replace Chakra UI imports with our own UI components
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Progress 
} from "@/components/ui/progress";
import { 
  Badge 
} from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  FaPlay, 
  FaCheck, 
  FaLock, 
  FaBookOpen, 
  FaVideo, 
  FaFileAlt, 
  FaQuestionCircle, 
  FaUserFriends, 
  FaChalkboardTeacher,
  FaDownload,
  FaClipboardCheck,
  FaCertificate
} from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  sections: Section: any[];
  resources: Resource: any[];
  completed: boolean;
  progress: number;
}

interface Section {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'activity' | 'reflection';
  content: string;
  duration: string;
  completed: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'template';
  url: string;
  description: string;
}

interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: Question: any[];
  passingScore: number;
}

interface Question {
  id: string;
  text: string;
  options: string: any[];
  correctAnswer: number;
}

interface UserProgress {
  userId: string;
  moduleId: string;
  completedSections: string: any[];
  quizScores: Record<string, number>;
  certificateIssued: boolean;
  lastAccessed: string;
}

const StaffTrainingModules: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [activeTab, setActiveTab] = useState(0);
  const [modules, setModules] = useState<Module[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [certificateModule, setCertificateModule] = useState<Module | null>(null);

  // Fetch modules and user progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch modules
        const modulesResponse = await fetch('/api/restorative-justice/staff-training/modules');
        const modulesData = await modulesResponse.json();
        
        if (session?.user?.id) {
          // Fetch user progress
          const progressResponse = await fetch(`/api/restorative-justice/staff-training/progress?userId=${session.user.id}`);
          const progressData = await progressResponse.json();
          
          setUserProgress(progressData);
          
          // Update modules with user progress
          const updatedModules = modulesData.map((module: Module) => {
            const userModuleProgress = progressData.find((p: UserProgress) => p.moduleId === module.id);
            
            if (userModuleProgress) {
              const completedSections = userModuleProgress.completedSections.length;
              const totalSections = module.sections.length;
              const progress = Math.round((completedSections / totalSections) * 100);
              
              return {
                ...module,
                progress,
                completed: progress === 100
              };
            }
            
            return {
              ...module,
              progress: 0,
              completed: false
            };
          });
          
          setModules(updatedModules);
        } else {
          setModules(modulesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load training modules. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session, toast]);

  // Handle module selection
  const handleModuleSelect = async (module: Module) => {
    setCurrentModule(module);
    setCurrentSection(module.sections[0]);
    
    // Record module access
    if (session?.user?.id) {
      try {
        await fetch('/api/restorative-justice/staff-training/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            moduleId: module.id,
            action: 'access'
          }),
        });
      } catch (error) {
        console.error('Error recording module access:', error);
      }
    }
  };

  // Handle section completion
  const handleSectionComplete = async (section: Section) => {
    if (!session?.user?.id || !currentModule) return;
    
    try {
      const response = await fetch('/api/restorative-justice/staff-training/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: currentModule.id,
          sectionId: section.id,
          action: 'complete'
        }),
      });
      
      const data = await response.json();
      
      // Update user progress
      setUserProgress(prev => {
        const updated = [...prev];
        const index = updated.findIndex(p => p.moduleId === currentModule.id);
        
        if (index >= 0) {
          updated[index] = data;
        } else {
          updated.push(data);
        }
        
        return updated;
      });
      
      // Update modules progress
      setModules(prev => {
        const updated = [...prev];
        const moduleIndex = updated.findIndex(m => m.id === currentModule.id);
        
        if (moduleIndex >= 0) {
          const completedSections = data.completedSections.length;
          const totalSections = updated[moduleIndex].sections.length;
          const progress = Math.round((completedSections / totalSections) * 100);
          
          updated[moduleIndex] = {
            ...updated[moduleIndex],
            progress,
            completed: progress === 100
          };
        }
        
        return updated;
      });
      
      // Move to next section if available
      if (currentModule) {
        const currentIndex = currentModule.sections.findIndex(s => s.id === section.id);
        if (currentIndex < currentModule.sections.length - 1) {
          setCurrentSection(currentModule.sections[currentIndex + 1]);
        } else {
          // Module completed
          toast({
            title: 'Section completed',
            description: 'You have completed this section.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          
          // Check if entire module is completed
          const moduleProgress = data.completedSections.length / currentModule.sections.length;
          if (moduleProgress === 1) {
            toast({
              title: 'Module completed',
              description: 'Congratulations! You have completed this module.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            
            setCertificateModule(currentModule);
            onOpen();
          }
        }
      }
    } catch (error) {
      console.error('Error completing section:', error);
      toast({
        title: 'Error',
        description: 'Failed to record progress. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle quiz submission
  const handleQuizSubmit = async () => {
    if (!currentQuiz || !session?.user?.id || !currentModule) return;
    
    // Calculate score
    let correctAnswers = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Record quiz score
    try {
      await fetch('/api/restorative-justice/staff-training/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: currentModule.id,
          quizId: currentQuiz.id,
          score,
          action: 'quiz'
        }),
      });
      
      // If passing score, mark section as complete
      if (score >= currentQuiz.passingScore) {
        const quizSection = currentModule.sections.find(s => s.type === 'quiz');
        if (quizSection) {
          handleSectionComplete(quizSection);
        }
      }
    } catch (error) {
      console.error('Error recording quiz score:', error);
    }
  };

  // Handle certificate generation
  const handleGenerateCertificate = async () => {
    if (!certificateModule || !session?.user?.id) return;
    
    try {
      const response = await fetch('/api/restorative-justice/staff-training/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          moduleId: certificateModule.id,
        }),
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${certificateModule.title.replace(/\s+/g, '_')}_Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Certificate generated',
        description: 'Your certificate has been generated and downloaded.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate certificate. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Reset current module view
  const handleBackToModules = () => {
    setCurrentModule(null);
    setCurrentSection(null);
    setCurrentQuiz(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // Render module catalog
  const renderModuleCatalog = () => {
    return (
      <Box>
        <Heading as="h1" size="xl" mb={6}>Staff Training on Restorative Approaches</Heading>
        <Text fontSize="lg" mb={8}>
          Comprehensive professional development resources to support educators in effectively implementing 
          restorative practices in their classrooms and schools. These evidence-based modules are designed 
          to build knowledge, skills, and confidence in using restorative approaches.
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {modules.map((module) => (
            <Card key={module.id} variant="outline" borderRadius="lg" overflow="hidden" boxShadow="md">
              <CardHeader bg="blue.50" pb={2}>
                <Flex justify="space-between" align="centre">
                  <Heading size="md">{module.title}</Heading>
                  <Badge colorScheme={module.level === 'Beginner' ? 'green' : module.level === 'Intermediate' ? 'blue' : 'purple'}>
                    {module.level}
                  </Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                <Text mb={4}>{module.description}</Text>
                <Flex justify="space-between" align="centre" mb={4}>
                  <Text fontSize="sm" colour="grey.600">
                    <Icon as={FaChalkboardTeacher} mr={1} />
                    {module.duration}
                  </Text>
                  <Text fontSize="sm" colour="grey.600">
                    <Icon as={FaBookOpen} mr={1} />
                    {module.sections.length} sections
                  </Text>
                </Flex>
                <Progress value={module.progress} colorScheme="blue" size="sm" mb={4} borderRadius="full" />
                <Text fontSize="sm" textAlign="right" mb={2}>
                  {module.progress}% complete
                </Text>
              </CardBody>
              <CardFooter pt={0}>
                <Button 
                  colorScheme="blue" 
                  leftIcon={module.completed ? <FaCheck /> : <FaPlay />}
                  onClick={() => handleModuleSelect(module)}
                  width="full"
                >
                  {module.completed ? 'Review Module' : module.progress > 0 ? 'Continue' : 'Start Module'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    );
  };

  // Render module content
  const renderModuleContent = () => {
    if (!currentModule || !currentSection) return null;
    
    return (
      <Box>
        <Flex justify="space-between" align="centre" mb={6}>
          <Button leftIcon={<FaChalkboardTeacher />} onClick={handleBackToModules} variant="outline">
            Back to Modules
          </Button>
          <Badge colorScheme={currentModule.level === 'Beginner' ? 'green' : currentModule.level === 'Intermediate' ? 'blue' : 'purple'} p={2}>
            {currentModule.level} Level
          </Badge>
        </Flex>
        
        <Heading as="h1" size="xl" mb={2}>{currentModule.title}</Heading>
        <Text fontSize="md" colour="grey.600" mb={6}>
          {currentModule.duration} • {currentModule.sections.length} sections
        </Text>
        
        <Progress value={currentModule.progress} colorScheme="blue" size="md" mb={6} borderRadius="full" />
        
        <Flex mb={8}>
          <Tabs orientation="vertical" variant="line" flex={1}>
            <TabList minW="250px" borderRight="1px" borderColor="grey.200">
              {currentModule.sections.map((section, index) => {
                const isCompleted = userProgress.some(p => 
                  p.moduleId === currentModule.id && 
                  p.completedSections.includes(section.id)
                );
                
                return (
                  <Tab 
                    key={section.id} 
                    justifyContent="flex-start" 
                    py={4}
                    _selected={{ color: 'blue.500', borderLeft: '4px solid', borderLeftColor: 'blue.500', bg: 'blue.50' }}
                    onClick={() => setCurrentSection(section)}
                  >
                    <Flex align="centre" width="100%">
                      <Box mr={3}>
                        {isCompleted ? (
                          <Icon as={FaCheck} colour="green.500" />
                        ) : (
                          <Box w={4} h={4} borderRadius="full" bg={index === 0 || userProgress.some(p => 
                            p.moduleId === currentModule.id && 
                            p.completedSections.includes(currentModule.sections[index-1]?.id)
                          ) ? "blue.500" : "grey.300"} />
                        )}
                      </Box>
                      <Box flex={1}>
                        <Text fontSize="sm" fontWeight="medium" textAlign="left">{section.title}</Text>
                        <Flex align="centre" mt={1}>
                          {section.type === 'video' && <Icon as={FaVideo} colour="grey.500" mr={1} size="xs" />}
                          {section.type === 'text' && <Icon as={FaFileAlt} colour="grey.500" mr={1} size="xs" />}
                          {section.type === 'quiz' && <Icon as={FaQuestionCircle} colour="grey.500" mr={1} size="xs" />}
                          {section.type === 'activity' && <Icon as={FaUserFriends} colour="grey.500" mr={1} size="xs" />}
                          {section.type === 'reflection' && <Icon as={FaBookOpen} colour="grey.500" mr={1} size="xs" />}
                          <Text fontSize="xs" colour="grey.500">{section.duration}</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Tab>
                );
              })}
            </TabList>
            
            <TabPanels flex={3} pl={8}>
              <TabPanel p={0}>
                <Box>
                  <Heading as="h2" size="lg" mb={4}>{currentSection.title}</Heading>
                  
                  {currentSection.type === 'video' && (
                    <Box mb={6}>
                      <Box 
                        bg="grey.100" 
                        borderRadius="md" 
                        height="400px" 
                        display="flex" 
                        alignItems="centre" 
                        justifyContent="centre"
                        mb={4}
                      >
                        <Text>Video content would be embedded here</Text>
                      </Box>
                      <Text whiteSpace="pre-wrap">{currentSection.content}</Text>
                    </Box>
                  )}
                  
                  {currentSection.type === 'text' && (
                    <Box mb={6}>
                      <Text whiteSpace="pre-wrap">{currentSection.content}</Text>
                    </Box>
                  )}
                  
                  {currentSection.type === 'quiz' && (
                    <Box mb={6}>
                      {/* Quiz content would be rendered here */}
                      <Text mb={4}>Quiz content would be rendered here based on the quiz data</Text>
                    </Box>
                  )}
                  
                  {currentSection.type === 'activity' && (
                    <Box mb={6}>
                      <Text whiteSpace="pre-wrap">{currentSection.content}</Text>
                    </Box>
                  )}
                  
                  {currentSection.type === 'reflection' && (
                    <Box mb={6}>
                      <Text whiteSpace="pre-wrap">{currentSection.content}</Text>
                    </Box>
                  )}
                  
                  <Flex justify="space-between" mt={8}>
                    <Button 
                      variant="outline" 
                      isDisabled={currentModule.sections.indexOf(currentSection) === 0}
                      onClick={() => {
                        const currentIndex = currentModule.sections.indexOf(currentSection);
                        if (currentIndex > 0) {
                          setCurrentSection(currentModule.sections[currentIndex - 1]);
                        }
                      }}
                    >
                      Previous
                    </Button>
                    
                    <Button 
                      colorScheme="blue" 
                      onClick={() => handleSectionComplete(currentSection)}
                    >
                      {currentModule.sections.indexOf(currentSection) === currentModule.sections.length - 1 
                        ? 'Complete Module' 
                        : 'Mark as Complete'}
                    </Button>
                  </Flex>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        
        <Divider my={8} />
        
        <Box>
          <Heading as="h3" size="md" mb={4}>Module Resources</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {currentModule.resources.map((resource) => (
              <Card key={resource.id} variant="outline">
                <CardBody>
                  <Flex align="centre" mb={2}>
                    {resource.type === 'pdf' && <Icon as={FaFileAlt} colour="red.500" mr={2} />}
                    {resource.type === 'video' && <Icon as={FaVideo} colour="blue.500" mr={2} />}
                    {resource.type === 'link' && <Icon as={FaBookOpen} colour="green.500" mr={2} />}
                    {resource.type === 'template' && <Icon as={FaClipboardCheck} colour="purple.500" mr={2} />}
                    <Heading size="sm">{resource.title}</Heading>
                  </Flex>
                  <Text fontSize="sm" mb={3}>{resource.description}</Text>
                  <Button 
                    size="sm" 
                    leftIcon={<FaDownload />} 
                    colorScheme="blue" 
                    variant="outline"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    Download
                  </Button>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    );
  };

  // Certificate modal
  const renderCertificateModal = () => {
    if (!certificateModule) return null;
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Module Completion Certificate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box textAlign="centre" py={6}>
              <Icon as={FaCertificate} w={24} h={24} colour="gold" mb={4} />
              <Heading size="lg" mb={2}>Congratulations!</Heading>
              <Text fontSize="lg" mb={6}>
                You have successfully completed the module:
              </Text>
              <Heading size="md" mb={6} colour="blue.600">
                {certificateModule.title}
              </Heading>
              <Text mb={8}>
                Click the button below to generate your certificate of completion.
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" leftIcon={<FaDownload />} onClick={handleGenerateCertificate}>
              Generate Certificate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Box maxW="1200px" mx="auto" px={4} py={8}>
      {isLoading ? (
        <Flex justify="centre" align="centre" height="400px">
          <Text>Loading training modules...</Text>
        </Flex>
      ) : (
        <>
          {currentModule ? renderModuleContent() : renderModuleCatalog()}
          {renderCertificateModal()}
        </>
      )}
    </Box>
  );
};

export default StaffTrainingModules;
