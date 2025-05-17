'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  Users, 
  Lightbulb, 
  BarChart, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Headphones,
  PenTool,
  HandHeart,
  Microscope
} from "lucide-react";

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="h-10 w-10 text-teal-600" />,
      title: "AI-Powered Learning Style Assessment",
      description: "Automatically identifies each student's learning style and transforms educational content to match their preferences."
    },
    {
      icon: <HandHeart className="h-10 w-10 text-amber-500" />,
      title: "Emotional Well-Being Monitoring",
      description: "Daily emotional check-ins with AI-powered pattern recognition to identify concerns early and suggest personalized strategies."
    },
    {
      icon: <PenTool className="h-10 w-10 text-blue-600" />,
      title: "Teacher Administrative Automation",
      description: "Dramatically reduces administrative burdens through AI-generated documentation, planning tools, and progress tracking."
    },
    {
      icon: <Users className="h-10 w-10 text-indigo-600" />,
      title: "Curriculum Planning & Collaboration",
      description: "Collaborative curriculum planning tools that align with UK standards and automatically adapt to student needs."
    },
    {
      icon: <Sparkles className="h-10 w-10 text-purple-600" />,
      title: "Immersive Learning Experiences",
      description: "Interactive 3D environments and immersive technologies that make learning engaging and memorable."
    },
    {
      icon: <Headphones className="h-10 w-10 text-green-600" />,
      title: "Voice Input & Accessibility",
      description: "Advanced speech recognition optimized for children's voices, allowing all students to participate fully."
    }
  ];

  const testimonials = [
    {
      quote: "EdPsych Connect has transformed how we support diverse learning needs in our school.",
      author: "Sarah Thompson",
      role: "Headteacher, Primary School"
    },
    {
      quote: "The reduction in administrative work has given me back time to focus on what matters - my students.",
      author: "James Wilson",
      role: "Year 6 Teacher"
    },
    {
      quote: "For the first time, my son feels understood and engaged in his learning journey.",
      author: "Michelle Davies",
      role: "Parent"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="container mx-auto px-4 py-20 sm:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Revolutionising Education Through AI-Powered Personalisation
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-blue-100">
                Transforming how children learn and how educators teach through evidence-based psychological principles and cutting-edge AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Link href="/about" className="flex items-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/auth/register" className="flex items-center gap-2">
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Executive Summary Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Executive Summary</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                EdPsych Connect is a groundbreaking educational platform that addresses the most pressing challenges in modern education: teacher burnout, student disengagement, and the inability of traditional systems to meet diverse learning needs.
              </p>
              <p>
                Developed by Dr. Scott Ighavongbe-Patrick, an experienced Educational Psychologist with over 18 years in the field of education and psychology, EdPsych Connect represents the culmination of extensive research and practical experience in UK educational settings.
              </p>
              <p>
                By automating administrative tasks and differentiating curriculum content, EdPsych Connect frees teachers to focus on what matters most—building meaningful relationships with students and providing quality pastoral care. The platform delivers personalised learning experiences that adapt to each child's unique learning style, emotional needs, and educational requirements.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Personalised Learning</h3>
                    <p className="text-muted-foreground">
                      Adapts to individual learning styles, interests, and needs for maximum engagement
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Lightbulb className="h-10 w-10 text-teal-600 dark:text-teal-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Teacher Empowerment</h3>
                    <p className="text-muted-foreground">
                      Reduces administrative burden, freeing educators for quality teaching and pastoral care
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <BarChart className="h-10 w-10 text-amber-600 dark:text-amber-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Evidence-Based</h3>
                    <p className="text-muted-foreground">
                      Built on psychological research and proven educational methodologies
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Revolutionary Features</h2>
            <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              EdPsych Connect transforms education through these innovative capabilities
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-lg transition-all duration-300 cursor-pointer ${
                      activeFeature === index 
                        ? 'bg-white dark:bg-slate-800 shadow-md' 
                        : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                <div className="aspect-video relative bg-slate-100 dark:bg-slate-700 rounded-lg mb-6 flex items-center justify-center">
                  {/* This would be a feature screenshot or illustration in production */}
                  <div className="text-center p-8">
                    <div className="flex justify-center mb-4">
                      {features[activeFeature].icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{features[activeFeature].title}</h3>
                    <p className="text-muted-foreground">Interactive preview would appear here</p>
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3">Key Benefits:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span>Increased student engagement and information retention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span>Reduced frustration and improved learning outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span>Support for diverse learning needs in inclusive classrooms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Who EdPsych Connect Serves</h2>
            <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              Designed for the entire educational ecosystem
            </p>
            
            <Tabs defaultValue="students" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="educators">Educators</TabsTrigger>
                <TabsTrigger value="professionals">Professionals</TabsTrigger>
              </TabsList>
              <TabsContent value="students" className="p-6 bg-white dark:bg-slate-800 rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      {/* This would be an illustration in production */}
                      <Users className="h-20 w-20 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-semibold mb-4">Children and Young People</h3>
                    <p className="mb-4">
                      From Nursery to the end of secondary school within the UK educational system, EdPsych Connect supports learners of all abilities and backgrounds.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Personalized learning paths based on individual learning styles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Emotional well-being support and development</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Engaging, interactive learning experiences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Voice input options for those who struggle with typing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="educators" className="p-6 bg-white dark:bg-slate-800 rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                      {/* This would be an illustration in production */}
                      <BookOpen className="h-20 w-20 text-teal-600 dark:text-teal-400" />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-semibold mb-4">Teachers and School Staff</h3>
                    <p className="mb-4">
                      EdPsych Connect empowers educators by reducing administrative burdens and providing tools for effective, differentiated teaching.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Automated documentation and planning tools</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Collaborative curriculum development</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Insights into student learning styles and needs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>More time for quality teaching and pastoral care</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="professionals" className="p-6 bg-white dark:bg-slate-800 rounded-lg mt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                      {/* This would be an illustration in production */}
                      <Microscope className="h-20 w-20 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-semibold mb-4">Educational Professionals</h3>
                    <p className="mb-4">
                      Support professionals including Educational Psychologists, SENCOs, and counsellors benefit from comprehensive tools and insights.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Comprehensive assessment and intervention tools</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Evidence-based resources and strategies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Data-driven insights for targeted support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>Collaborative tools for multi-disciplinary approaches</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">What People Are Saying</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <div className="mb-4 text-amber-300">
                    {"★".repeat(5)}
                  </div>
                  <p className="mb-6 text-lg italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-blue-200">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Education?</h2>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              Join the revolution in educational technology and discover how EdPsych Connect can empower your school, students, and staff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                <Link href="/auth/register" className="flex items-center gap-2">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link href="/about" className="flex items-center gap-2">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
