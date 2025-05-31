"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Users, 
  BarChart3, 
  Brain, 
  Lightbulb, 
  Mic, 
  Globe, 
  School, 
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Zap,
  Layers,
  MessageSquare,
  Award
} from 'lucide-react';

// Hero section animation variants
const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Feature card animation variants
const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('educators');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Main feature sections
  const features = [
    {
      id: 'personalized-learning',
      title: 'Personalized Learning Paths',
      description: 'Tailored learning experiences based on individual starting points, learning styles, and interests.',
      icon: <Layers className="h-10 w-10 text-blue-500" />,
      link: '/learning-path',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'curriculum-content',
      title: 'Curriculum Content Management',
      description: 'Comprehensive UK curriculum-aligned content with adaptations for different learning styles.',
      icon: <BookOpen className="h-10 w-10 text-green-500" />,
      link: '/curriculum-content/dashboard',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'student-analytics',
      title: 'Student Progress Analytics',
      description: 'Detailed insights into student progress with visualizations and actionable recommendations.',
      icon: <BarChart3 className="h-10 w-10 text-purple-500" />,
      link: '/student-analytics',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'accessibility',
      title: 'Enhanced Accessibility',
      description: 'Comprehensive accessibility features ensuring inclusive education for all learners.',
      icon: <UserCheck className="h-10 w-10 text-amber-500" />,
      link: '/accessibility/enhanced',
      color: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'voice-input',
      title: 'Voice Input Integration',
      description: 'Advanced voice recognition for children who struggle with typing, with age-appropriate interfaces.',
      icon: <Mic className="h-10 w-10 text-red-500" />,
      link: '/voice-input',
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 'multi-language',
      title: 'Multi-language Support',
      description: 'Full platform localization with preservation of UK curriculum terminology.',
      icon: <Globe className="h-10 w-10 text-indigo-500" />,
      link: '/settings/language',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'parent-portal',
      title: 'Parent Portal',
      description: 'Comprehensive tools for parents to monitor progress and support their children\'s learning.',
      icon: <Users className="h-10 w-10 text-pink-500" />,
      link: '/parent-portal',
      color: 'bg-pink-50 border-pink-200'
    },
    {
      id: 'lms-integration',
      title: 'LMS Integration',
      description: 'Seamless connection with popular Learning Management Systems used in UK schools.',
      icon: <Zap className="h-10 w-10 text-orange-500" />,
      link: '/integration/lms-configuration',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: 'restorative-justice',
      title: 'Restorative Justice',
      description: 'Evidence-based approaches to building relationships and understanding behavior.',
      icon: <MessageSquare className="h-10 w-10 text-teal-500" />,
      link: '/restorative-justice',
      color: 'bg-teal-50 border-teal-200'
    }
  ];
  
  // User-specific benefits
  const userBenefits = {
    educators: [
      { title: 'Reduced Administrative Burden', description: 'Automation of routine tasks frees up time for quality teaching' },
      { title: 'Data-Driven Insights', description: 'Comprehensive analytics to inform teaching strategies' },
      { title: 'Curriculum Alignment', description: 'All content aligned with UK educational standards' },
      { title: 'Professional Development', description: 'Continuous learning opportunities and resources' }
    ],
    students: [
      { title: 'Personalized Learning', description: 'Content adapted to individual learning styles and needs' },
      { title: 'Engaging Experiences', description: 'Interactive and immersive learning activities' },
      { title: 'Progress Tracking', description: 'Clear visualization of achievements and next steps' },
      { title: 'Accessibility Features', description: 'Support for diverse learning needs and preferences' }
    ],
    parents: [
      { title: 'Progress Monitoring', description: 'Real-time insights into child\'s educational journey' },
      { title: 'Teacher Communication', description: 'Streamlined channels for parent-teacher collaboration' },
      { title: 'Resource Access', description: 'Supporting materials to assist learning at home' },
      { title: 'Involvement Opportunities', description: 'Ways to actively participate in educational process' }
    ]
  };
  
  // Testimonials
  const testimonials = [
    {
      quote: "EdPsych Connect has transformed how we support students with diverse learning needs. The personalized learning paths and accessibility features have made a remarkable difference.",
      author: "Sarah Johnson",
      role: "Head Teacher, London Primary School"
    },
    {
      quote: "As an educational psychologist, I've seen firsthand how the platform's evidence-based approach helps children develop confidence and overcome learning challenges.",
      author: "Dr. Michael Chen",
      role: "Educational Psychologist"
    },
    {
      quote: "The parent portal gives me unprecedented insight into my child's learning journey. I feel more connected to their education than ever before.",
      author: "Emma Williams",
      role: "Parent of Year 4 Student"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                className="max-w-4xl mx-auto text-center space-y-8"
                initial="hidden"
                animate="visible"
                variants={heroVariants}
              >
                <motion.div variants={itemVariants}>
                  <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                    UK Curriculum Aligned
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Transforming Education Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Personalized Learning</span>
                  </h1>
                </motion.div>
                
                <motion.p variants={itemVariants} className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                  EdPsych Connect empowers educators, students, and parents with evidence-based tools for inclusive, 
                  personalized, and engaging educational experiences.
                </motion.p>
                
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8"
                    onClick={() => router.push('/auth/register')}
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 text-lg px-8"
                    onClick={() => router.push('/demo')}
                  >
                    Watch Demo
                  </Button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="pt-8">
                  <div className="flex flex-wrap justify-center gap-8 text-sm text-blue-100">
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      <span>UK Curriculum Aligned</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      <span>Evidence-Based Approach</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      <span>Inclusive Education</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="white" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Platform Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Educational Tools</h2>
            <p className="text-lg text-gray-600">
              EdPsych Connect offers a complete suite of features designed to support the entire educational journey,
              from personalized learning paths to detailed analytics and accessibility tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.link}>
                  <Card className={`h-full border-2 hover:shadow-lg transition-all ${feature.color} hover:scale-[1.02]`}>
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4 flex-grow">{feature.description}</p>
                      <div className="flex items-center text-blue-600 font-medium">
                        <span>Explore</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* User Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Tailored For Everyone</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Benefits For All Users</h2>
            <p className="text-lg text-gray-600">
              EdPsych Connect is designed to support the entire educational community with specialized features
              for educators, students, and parents.
            </p>
          </div>
          
          <Tabs
            defaultValue="educators"
            value={activeTab}
            onValueChange={setActiveTab}
            className="max-w-4xl mx-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="educators" className="text-base">
                <School className="mr-2 h-5 w-5" />
                Educators
              </TabsTrigger>
              <TabsTrigger value="students" className="text-base">
                <BookOpen className="mr-2 h-5 w-5" />
                Students
              </TabsTrigger>
              <TabsTrigger value="parents" className="text-base">
                <Users className="mr-2 h-5 w-5" />
                Parents
              </TabsTrigger>
            </TabsList>
            
            {Object.entries(userBenefits).map(([key, benefits]) => (
              <TabsContent key={key} value={key} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                    >
                      <h3 className="text-xl font-bold mb-2 flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Community Says</h2>
            <p className="text-lg text-gray-600">
              Hear from educators, psychologists, and parents about how EdPsych Connect
              is making a difference in education.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
              >
                <div className="text-blue-600 mb-4">
                  <svg width="45" height="36" className="fill-current">
                    <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z"></path>
                  </svg>
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Educational Approach?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of educators, students, and parents already benefiting from EdPsych Connect's
              innovative educational platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8"
                onClick={() => router.push('/auth/register')}
              >
                Get Started Today
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-lg px-8"
                onClick={() => router.push('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog and Resources Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Latest Updates</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Blog & Resources</h2>
            <p className="text-lg text-gray-600">
              Explore our latest articles, research insights, and educational resources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link href="/blog/personalized-learning-research">
              <Card className="h-full hover:shadow-md transition-all">
                <div className="aspect-video relative bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <BookOpen className="h-10 w-10" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2">Research</Badge>
                  <h3 className="text-xl font-bold mb-2">The Impact of Personalized Learning on Student Outcomes</h3>
                  <p className="text-gray-600 mb-4">Exploring the latest research on how personalized learning approaches improve educational outcomes.</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>5 min read</span>
                    <span className="mx-2">•</span>
                    <span>May 25, 2025</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/blog/accessibility-education">
              <Card className="h-full hover:shadow-md transition-all">
                <div className="aspect-video relative bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <UserCheck className="h-10 w-10" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2">Accessibility</Badge>
                  <h3 className="text-xl font-bold mb-2">Creating Truly Inclusive Digital Learning Environments</h3>
                  <p className="text-gray-600 mb-4">Best practices for ensuring educational technology is accessible to all learners.</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>7 min read</span>
                    <span className="mx-2">•</span>
                    <span>May 18, 2025</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/blog/voice-input-education">
              <Card className="h-full hover:shadow-md transition-all">
                <div className="aspect-video relative bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Mic className="h-10 w-10" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2">Technology</Badge>
                  <h3 className="text-xl font-bold mb-2">Voice Input: Revolutionizing Access for Struggling Writers</h3>
                  <p className="text-gray-600 mb-4">How voice recognition technology is helping children who struggle with typing and writing.</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>6 min read</span>
                    <span className="mx-2">•</span>
                    <span>May 10, 2025</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/blog')}
              className="px-8"
            >
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EdPsych Connect</h3>
              <p className="text-gray-400 mb-4">
                Transforming education through personalized, inclusive, and evidence-based approaches.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/learning-path" className="text-gray-400 hover:text-white">Learning Paths</Link></li>
                <li><Link href="/curriculum-content/dashboard" className="text-gray-400 hover:text-white">Curriculum Content</Link></li>
                <li><Link href="/student-analytics" className="text-gray-400 hover:text-white">Analytics</Link></li>
                <li><Link href="/accessibility/enhanced" className="text-gray-400 hover:text-white">Accessibility</Link></li>
                <li><Link href="/voice-input" className="text-gray-400 hover:text-white">Voice Input</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/professional-development" className="text-gray-400 hover:text-white">Professional Development</Link></li>
                <li><Link href="/restorative-justice" className="text-gray-400 hover:text-white">Restorative Justice</Link></li>
                <li><Link href="/special-needs" className="text-gray-400 hover:text-white">Special Needs Support</Link></li>
                <li><Link href="/uk-educational-compliance" className="text-gray-400 hover:text-white">UK Compliance</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 EdPsych Connect Limited. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <Badge variant="outline" className="text-gray-400 border-gray-700">
                UK Curriculum Aligned
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
