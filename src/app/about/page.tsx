'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Target, Lightbulb, BookOpen, Heart, Award } from 'lucide-react';
import { UILink } from '@/components/ui';

export default function AboutPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About EdPsych Connect</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transforming education through the perfect blend of educational psychology principles and cutting-edge technology.
        </p>
      </motion.div>

      {/* Mission and Vision */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-centre"
      >
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-bold mb-6">Our Mission &amp; Vision</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Mission</h3>
                <p className="text-muted-foreground">
                  To empower every learner through personalized, evidence-based educational experiences that adapt to individual needs, learning styles, and developmental stages.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Vision</h3>
                <p className="text-muted-foreground">
                  A world where every child has access to personalized education that recognizes their unique potential, adapts to their individual learning journey, and empowers them to thrive in an ever-changing future.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Button asChild>
              <UILink href="/about/team">
                Meet Our Team <ChevronRight className="ml-2 h-4 w-4" />
              </UILink>
            </Button>
          </div>
        </div>
        
        <div className="order-1 md:order-2 relative h-[400px] rounded-xl overflow-hidden shadow-xl">
          <Image 
            src="/images/about/mission-vision.jpg" 
            alt="Students engaged in personalized learning" 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </motion.section>

      {/* Our Story */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-centre">Our Story</h2>
        
        <Tabs defaultValue="beginning" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="beginning">The Beginning</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="future">Future Vision</TabsTrigger>
          </TabsList>
          
          <TabsContent value="beginning" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-centre">
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src="/images/about/beginning.jpg" 
                  alt="The beginning of EdPsych Connect" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">From Vision to Reality</h3>
                <p className="text-muted-foreground mb-4">
                  EdPsych Connect began with Dr. Scott Ighavongbe-Patrick&apos;s vision to transform educational experiences for all children. Drawing from over 12 years of experience as an Educational Psychologist, Dr. Scott recognised the need for a platform that could truly personalize learning based on sound educational psychology principles.
                </p>
                <p className="text-muted-foreground">
                  The platform was born from a commitment to empower learners through tailored, evidence-based support, with a particular focus on creating equitable access for disadvantaged children and young people.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="development" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-centre">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Building the Platform</h3>
                <p className="text-muted-foreground mb-4">
                  The development of EdPsych Connect brought together experts in educational psychology, technology, and design. The team worked tirelessly to create a platform that seamlessly integrates cutting-edge AI technology with evidence-based educational practices.
                </p>
                <p className="text-muted-foreground">
                  Each feature was carefully designed to address specific learning needs, from adaptive complexity adjustment to voice input functionality for children who struggle with typing. The platform evolved through continuous feedback from educators, parents, and students, ensuring it truly serves its users.
                </p>
              </div>
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src="/images/about/development.jpg" 
                  alt="The development of EdPsych Connect" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="future" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-centre">
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src="/images/about/future.jpg" 
                  alt="The future vision of EdPsych Connect" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Looking Forward</h3>
                <p className="text-muted-foreground mb-4">
                  The future of EdPsych Connect is focused on continuous innovation and expansion. We envision a platform that not only adapts to individual learning needs but anticipates them, creating truly personalized educational journeys for every child.
                </p>
                <p className="text-muted-foreground">
                  Our roadmap includes advanced features like neuroscience-informed adaptive interfaces, digital twin learning companions, and integrated biofeedback systems. We&apos;re committed to pushing the boundaries of what&apos;s possible in educational technology while staying true to our foundation in educational psychology principles.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* Core Values */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-centre">Our Core Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="h-2 bg-primary"></div>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Evidence-Based Approach</h3>
              <p className="text-muted-foreground">
                We ground all our features and methodologies in sound educational psychology research and evidence-based practices, ensuring that our platform delivers real educational value.
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="h-2 bg-primary"></div>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inclusive Education</h3>
              <p className="text-muted-foreground">
                We believe in creating educational experiences that are accessible to all learners, regardless of background, ability, or learning style, with a particular focus on supporting disadvantaged children.
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="h-2 bg-primary"></div>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence in Innovation</h3>
              <p className="text-muted-foreground">
                We strive for excellence in everything we do, constantly pushing the boundaries of what&apos;s possible in educational technology while maintaining the highest standards of quality and effectiveness.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-primary/5 rounded-xl p-8 md:p-12 text-centre"
      >
        <h2 className="text-3xl font-bold mb-4">Join Our Educational Journey</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover how EdPsych Connect is transforming education through personalized, evidence-based learning experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-centre mb-6">
          <Button size="lg" asChild>
            <UILink href="/register">Get Started</UILink>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <UILink href="/contact">Contact Us</UILink>
          </Button>
        </div>
        <div className="mt-4 border-t border-primary/10 pt-6">
          <h3 className="text-xl font-semibold mb-3">Featured Resources</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-centre">
            <Button variant="secondary" asChild>
              <UILink href="/ai-avatar-videos">
                Explore AI Avatar Videos with Dr. Scott
              </UILink>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
