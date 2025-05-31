'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Container, Typography, Flex, Card } from '@/components/ui/enhanced-layout-components';
import { Button, Input, Select, Textarea } from '@/components/ui/enhanced-form-components';
import { Tabs, TabsList, TabsTrigger, TabsContent, Accordion, AccordionItem } from '@/components/ui/enhanced-interactive-components';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfessionalDevelopmentPage() {
  const { ageGroup } = useEnhancedTheme();
  
  // Professional development categories
  const categories = [
    {
      id: 'core-training',
      title: 'Core Training Modules',
      description: 'Foundational knowledge and skills for educational professionals',
      image: '/images/professional-development/core-training.jpg'
    },
    {
      id: 'certification',
      title: 'Specialized Certification Pathways',
      description: 'In-depth training for specific educational roles and specializations',
      image: '/images/professional-development/certification.jpg'
    },
    {
      id: 'micro-learning',
      title: 'Micro-Learning Content',
      description: 'Bite-sized learning resources for busy professionals',
      image: '/images/professional-development/micro-learning.jpg'
    },
    {
      id: 'workshops',
      title: 'Interactive Workshops',
      description: 'Collaborative learning experiences led by industry experts',
      image: '/images/professional-development/workshops.jpg'
    }
  ];
  
  // Core training modules
  const coreModules = [
    {
      title: 'Inclusive Education',
      description: 'Strategies for creating inclusive learning environments that support all students',
      duration: '8 hours',
      level: 'Foundation'
    },
    {
      title: 'Special Educational Needs',
      description: 'Understanding and supporting students with diverse learning needs',
      duration: '10 hours',
      level: 'Foundation'
    },
    {
      title: 'Educational Psychology Principles',
      description: 'Core psychological theories and their application in educational settings',
      duration: '12 hours',
      level: 'Intermediate'
    },
    {
      title: 'Behavior Management',
      description: 'Evidence-based approaches to positive behavior support',
      duration: '6 hours',
      level: 'Foundation'
    },
    {
      title: 'Assessment for Learning',
      description: 'Using assessment to inform teaching and improve student outcomes',
      duration: '8 hours',
      level: 'Intermediate'
    },
    {
      title: 'Personalized Learning',
      description: 'Creating tailored learning experiences based on individual needs',
      duration: '10 hours',
      level: 'Advanced'
    }
  ];
  
  // Certification pathways
  const certificationPathways = [
    {
      title: 'SENCO Certification',
      description: 'Comprehensive training for Special Educational Needs Coordinators',
      duration: '60 hours',
      modules: 8
    },
    {
      title: 'Assessment Specialist',
      description: 'Advanced training in educational assessment and intervention',
      duration: '45 hours',
      modules: 6
    },
    {
      title: 'Behavior Support Practitioner',
      description: 'Specialized training in positive behavior support strategies',
      duration: '50 hours',
      modules: 7
    },
    {
      title: 'Educational Wellbeing Coach',
      description: 'Training to support student mental health and wellbeing',
      duration: '40 hours',
      modules: 5
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Typography variant="h1" className="mb-4">
                  Professional Development
                </Typography>
                <Typography variant="lead" className="mb-6">
                  Evidence-based training and certification programs designed by educational psychology experts to enhance your professional practice.
                </Typography>
                <Typography variant="body" className="mb-8">
                  Our comprehensive professional development offerings are built on sound educational psychology principles and designed to help you make a meaningful difference in the lives of children and young people.
                </Typography>
                <Flex gap="md">
                  <Button variant="primary" size="lg">
                    Explore Programs
                  </Button>
                  <Button variant="secondary" size="lg">
                    View Certifications
                  </Button>
                </Flex>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/professional-development/hero.jpg"
                  alt="Professional Development at EdPsych Connect"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </section>
        
        {/* Categories Section */}
        <section className="py-16">
          <Container>
            <Typography variant="h2" className="text-center mb-12">
              Professional Development Categories
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <Card key={category.id} className="p-6 h-full flex flex-col">
                  <div className="mb-4 aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Typography variant="h4" className="mb-2">
                    {category.title}
                  </Typography>
                  <Typography variant="body" className="mb-4 flex-grow">
                    {category.description}
                  </Typography>
                  <Button variant="outline" className="w-full">
                    Explore {category.title}
                  </Button>
                </Card>
              ))}
            </div>
          </Container>
        </section>
        
        {/* Core Training Modules */}
        <section className="py-16 bg-background">
          <Container>
            <Typography variant="h2" className="mb-12">
              Core Training Modules
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreModules.map((module, index) => (
                <Card key={index} className="p-6 h-full flex flex-col">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {module.level}
                    </span>
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-text-secondary ml-2">
                      {module.duration}
                    </span>
                  </div>
                  <Typography variant="h4" className="mb-2">
                    {module.title}
                  </Typography>
                  <Typography variant="body" className="mb-4 flex-grow">
                    {module.description}
                  </Typography>
                  <Button variant="outline" className="w-full">
                    View Module
                  </Button>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="primary" size="lg">
                View All Core Modules
              </Button>
            </div>
          </Container>
        </section>
        
        {/* Certification Pathways */}
        <section className="py-16 bg-primary/5">
          <Container>
            <Typography variant="h2" className="mb-12">
              Specialized Certification Pathways
            </Typography>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {certificationPathways.map((pathway, index) => (
                <Card key={index} className="p-6 h-full">
                  <Flex justify="between" align="start">
                    <div>
                      <Typography variant="h3" className="mb-2">
                        {pathway.title}
                      </Typography>
                      <Typography variant="body" className="mb-4">
                        {pathway.description}
                      </Typography>
                      <div className="flex items-center mb-4">
                        <div className="mr-6">
                          <Typography variant="small" color="muted">
                            Duration
                          </Typography>
                          <Typography variant="h6">
                            {pathway.duration}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="small" color="muted">
                            Modules
                          </Typography>
                          <Typography variant="h6">
                            {pathway.modules}
                          </Typography>
                        </div>
                      </div>
                      <Button variant="primary">
                        Learn More
                      </Button>
                    </div>
                    <div className="hidden lg:block">
                      <svg className="h-16 w-16 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                      </svg>
                    </div>
                  </Flex>
                </Card>
              ))}
            </div>
          </Container>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16">
          <Container>
            <Typography variant="h2" className="mb-12 text-center">
              Frequently Asked Questions
            </Typography>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" defaultValue="faq-1">
                <AccordionItem 
                  title="How are the professional development programs structured?" 
                  value="faq-1"
                >
                  <Typography variant="body">
                    Our professional development programs are structured as modular courses that can be completed at your own pace. Each module includes video lessons, interactive activities, assessments, and practical resources. Programs can be completed entirely online, with some offering optional in-person components.
                  </Typography>
                </AccordionItem>
                
                <AccordionItem 
                  title="Are the certifications recognized by educational institutions?" 
                  value="faq-2"
                >
                  <Typography variant="body">
                    Yes, our certifications are recognized by many educational institutions across the UK. We work closely with schools, local authorities, and professional bodies to ensure our programs meet industry standards and provide valuable credentials for your career advancement.
                  </Typography>
                </AccordionItem>
                
                <AccordionItem 
                  title="How long do I have access to the course materials?" 
                  value="faq-3"
                >
                  <Typography variant="body">
                    Once enrolled in a program, you have lifetime access to the course materials. This allows you to revisit content as needed and stay updated as we enhance and expand our resources. Certification programs may have specific timeframes for completion to ensure currency of knowledge.
                  </Typography>
                </AccordionItem>
                
                <AccordionItem 
                  title="Can I get support during my professional development journey?" 
                  value="faq-4"
                >
                  <Typography variant="body">
                    Absolutely! All participants have access to our support team and community forums. Certification pathways include mentoring sessions with experienced professionals in the field. We're committed to supporting your growth throughout your learning journey.
                  </Typography>
                </AccordionItem>
                
                <AccordionItem 
                  title="How are these programs different from other professional development offerings?" 
                  value="faq-5"
                >
                  <Typography variant="body">
                    Our programs are uniquely designed based on sound educational psychology principles and over 12 years of practical experience. They focus on evidence-based strategies that can be immediately applied in educational settings. The content is regularly updated to reflect the latest research and best practices in the field.
                  </Typography>
                </AccordionItem>
              </Accordion>
            </div>
          </Container>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 bg-primary/10">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <Typography variant="h2" className="mb-4">
                  Get in Touch
                </Typography>
                <Typography variant="lead" className="mb-6">
                  Have questions about our professional development offerings? We're here to help.
                </Typography>
                <Typography variant="body" className="mb-8">
                  Our team of educational psychology experts can provide personalized guidance on which programs best suit your professional goals and needs.
                </Typography>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <Typography variant="h6" className="mb-1">
                        Email
                      </Typography>
                      <Typography variant="body">
                        professional@edpsychconnect.com
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-primary mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <Typography variant="h6" className="mb-1">
                        Phone
                      </Typography>
                      <Typography variant="body">
                        +44 (0) 20 1234 5678
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="p-6">
                <Typography variant="h4" className="mb-6">
                  Request Information
                </Typography>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="First Name" 
                      placeholder="Enter your first name" 
                      isFullWidth 
                    />
                    <Input 
                      label="Last Name" 
                      placeholder="Enter your last name" 
                      isFullWidth 
                    />
                  </div>
                  
                  <Input 
                    label="Email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    isFullWidth 
                  />
                  
                  <Select 
                    label="Area of Interest" 
                    options={[
                      { value: "", label: "Select an area of interest" },
                      { value: "core-training", label: "Core Training Modules" },
                      { value: "certification", label: "Specialized Certification" },
                      { value: "micro-learning", label: "Micro-Learning Content" },
                      { value: "workshops", label: "Interactive Workshops" }
                    ]} 
                    isFullWidth 
                  />
                  
                  <Textarea 
                    label="Message" 
                    placeholder="How can we help you?" 
                    rows={4} 
                    isFullWidth 
                  />
                  
                  <Button variant="primary" className="w-full">
                    Submit Request
                  </Button>
                </form>
              </Card>
            </div>
          </Container>
        </section>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
