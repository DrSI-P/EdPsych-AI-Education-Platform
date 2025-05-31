'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Target, Lightbulb, BookOpen, Heart, Award, Users, School, Sparkles } from 'lucide-react';

export default function AboutPage(): React.ReactNode {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-primary">About EdPsych Connect</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transforming education through the perfect blend of educational psychology principles and cutting-edge technology.
        </p>
      </motion.div>

      {/* Mission and Vision */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center"
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
                  To empower every learner through personalised, evidence-based educational experiences that adapt to individual needs, learning styles, and developmental stages.
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
                  A world where every child has access to personalised education that recognises their unique potential, adapts to their individual learning journey, and empowers them to thrive in an ever-changing future.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Button asChild className="btn btn-primary">
              <Link href="/about/team">
                Meet Our Team <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="order-1 md:order-2 relative h-[400px] rounded-xl overflow-hidden shadow-xl">
          <Image 
            src="/images/about/mission-vision.jpg" 
            alt="Students engaged in personalised learning" 
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
        <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
        
        <Tabs defaultValue="beginning" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="beginning">The Beginning</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="future">Future Vision</TabsTrigger>
          </TabsList>
          
          <TabsContent value="beginning" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
                  EdPsych Connect began with Dr. Scott Ighavongbe-Patrick&apos;s vision to transform educational experiences for all children. Drawing from his experience as an Educational Psychologist, Dr. Scott recognised the need for a platform that could truly personalise learning based on sound educational psychology principles.
                </p>
                <p className="text-muted-foreground">
                  The platform was born from a commitment to empower learners through tailored, evidence-based support, with a particular focus on creating equitable access for disadvantaged children and young people across the UK educational system.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="development" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Building the Platform</h3>
                <p className="text-muted-foreground mb-4">
                  The development of EdPsych Connect has been ongoing over the last 3 years, bringing together experts in educational psychology, technology, and design. The team worked to create a platform that seamlessly integrates cutting-edge AI technology with evidence-based educational practices aligned with UK Department for Education standards.
                </p>
                <p className="text-muted-foreground">
                  Each feature was carefully designed to address specific learning needs, from adaptive complexity adjustment to voice input functionality for children who struggle with typing. The platform evolved through continuous feedback from educators, parents, and students across the UK.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
                  The future of EdPsych Connect is focused on continuous innovation and expansion. We envision a platform that not only adapts to individual learning needs but anticipates them, creating truly personalised educational journeys for every child within the UK educational framework.
                </p>
                <p className="text-muted-foreground">
                  Our roadmap includes advanced features like AI avatar videos with Dr. Scott, adaptive interfaces, and integrated learning tools. We&apos;re committed to pushing the boundaries of what&apos;s possible in educational technology while staying true to our foundation in educational psychology principles and UK curriculum standards.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* Educational Philosophy */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Our Educational Philosophy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
            <Image 
              src="/images/about/educational-philosophy.jpg" 
              alt="Educational philosophy in action" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Relationship-Centred Approach</h3>
                <p className="text-muted-foreground">
                  We believe that understanding the underlying causes of behaviour and building strong relationships are fundamental to effective education. Our platform incorporates principles of Restorative Justice to foster positive connections between learners, educators, and parents.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <School className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">UK Curriculum Alignment</h3>
                <p className="text-muted-foreground">
                  Our platform is meticulously aligned with the UK educational system, from nursery through secondary levels. We incorporate Key Stages, subject-specific requirements, and assessment frameworks to ensure seamless integration with classroom learning.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1 bg-primary/10 p-2 rounded-full">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Personalised Learning Pathways</h3>
                <p className="text-muted-foreground">
                  We recognise that every learner has unique starting points, learning styles, and interests. Our platform creates personalised learning pathways that adapt to individual needs, ensuring systematic curriculum coverage while maximising motivation and engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Core Values */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card card-interactive overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="h-2 bg-primary"></div>
            <CardContent className="card-body pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Evidence-Based Approach</h3>
              <p className="text-muted-foreground">
                We ground all our features and methodologies in sound educational psychology research and evidence-based practices, ensuring that our platform delivers real educational value aligned with UK educational standards.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card card-interactive overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="h-2 bg-primary"></div>
            <CardContent className="card-body pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inclusive Education</h3>
              <p className="text-muted-foreground">
                We believe in creating educational experiences that are accessible to all learners, regardless of background, ability, or learning style, with a particular focus on supporting disadvantaged children and young people across the UK.
              </p>
            </CardContent>
          </Card>
          
          <Card className="card card-interactive overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="h-2 bg-primary"></div>
            <CardContent className="card-body pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence in Innovation</h3>
              <p className="text-muted-foreground">
                We strive for excellence in everything we do, constantly pushing the boundaries of what&apos;s possible in educational technology while maintaining the highest standards of quality and effectiveness for UK learners.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Team Overview Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        
        <div className="text-center mb-8">
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our team brings together expertise in educational psychology, technology, and curriculum development to create a truly transformative learning platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="card overflow-hidden text-center">
            <div className="relative h-[200px] overflow-hidden">
              <Image 
                src="/images/team/dr-scott.jpg" 
                alt="Dr. Scott Ighavongbe-Patrick" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <CardContent className="card-body pt-6">
              <h3 className="text-xl font-semibold">Dr. Scott Ighavongbe-Patrick</h3>
              <p className="text-primary font-medium">Founder & Educational Psychologist</p>
            </CardContent>
          </Card>
          
          <Card className="card overflow-hidden text-center">
            <div className="relative h-[200px] overflow-hidden">
              <Image 
                src="/images/team/professor-worth.jpg" 
                alt="Professor Piers Worth" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <CardContent className="card-body pt-6">
              <h3 className="text-xl font-semibold">Professor Piers Worth</h3>
              <p className="text-primary font-medium">Psychologist and Trauma Resilience Expert</p>
            </CardContent>
          </Card>
          
          <Card className="card overflow-hidden text-center">
            <div className="relative h-[200px] overflow-hidden">
              <Image 
                src="/images/team/hayleigh.jpg" 
                alt="Hayleigh Baverstock" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <CardContent className="card-body pt-6">
              <h3 className="text-xl font-semibold">Hayleigh Baverstock</h3>
              <p className="text-primary font-medium">Senior Specialist Teacher and Inclusion Specialist</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="secondary" size="lg" className="btn btn-secondary" asChild>
            <Link href="/about/team">
              <span className="text-lg">Meet Our Full Team</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-primary/5 rounded-xl p-8 md:p-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Join Our Educational Journey</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover how EdPsych Connect is transforming education through personalised, evidence-based learning experiences aligned with UK educational standards.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button size="lg" className="btn btn-lg btn-primary" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" className="btn btn-lg btn-secondary" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
        <div className="mt-4 border-t border-primary/10 pt-6">
          <h3 className="text-xl font-semibold mb-3">Featured Resources</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" className="btn btn-secondary" asChild>
              <Link href="/ai-avatar-videos">
                Explore AI Avatar Videos with Dr. Scott
              </Link>
            </Button>
            <Button variant="secondary" className="btn btn-secondary" asChild>
              <Link href="/resources/uk-curriculum">
                UK Curriculum Resources
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
