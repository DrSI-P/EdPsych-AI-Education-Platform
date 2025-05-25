'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, FileText, Lock, UserCheck, Clock, AlertTriangle } from 'lucide-react';

export default function TermsOfServicePage(): React.ReactNode {
  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Please read these terms carefully before using the EdPsych Connect platform.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Last Updated: 18 May 2025
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-24">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Contents</h2>
              <nav className="space-y-1">
                <a href="#introduction" className="block p-2 rounded-md hover:bg-muted transition-colors">Introduction</a>
                <a href="#definitions" className="block p-2 rounded-md hover:bg-muted transition-colors">Definitions</a>
                <a href="#account" className="block p-2 rounded-md hover:bg-muted transition-colors">Account Registration</a>
                <a href="#services" className="block p-2 rounded-md hover:bg-muted transition-colors">Services</a>
                <a href="#content" className="block p-2 rounded-md hover:bg-muted transition-colors">User Content</a>
                <a href="#privacy" className="block p-2 rounded-md hover:bg-muted transition-colors">Privacy &amp; Data</a>
                <a href="#intellectual" className="block p-2 rounded-md hover:bg-muted transition-colors">Intellectual Property</a>
                <a href="#liability" className="block p-2 rounded-md hover:bg-muted transition-colors">Limitation of Liability</a>
                <a href="#termination" className="block p-2 rounded-md hover:bg-muted transition-colors">Termination</a>
                <a href="#changes" className="block p-2 rounded-md hover:bg-muted transition-colors">Changes to Terms</a>
                <a href="#contact" className="block p-2 rounded-md hover:bg-muted transition-colors">Contact Us</a>
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardContent className="p-6">
              <ScrollArea className="h-[800px] pr-4">
                <div className="space-y-8">
                  {/* Introduction */}
                  <section id="introduction">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Introduction</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Welcome to EdPsych Connect. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the EdPsych Connect platform, including any websites, mobile applications, and services offered by EdPsych Connect Limited (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                    </p>
                    <p className="text-muted-foreground mb-4">
                      By accessing or using our platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the platform.
                    </p>
                    <p className="text-muted-foreground">
                      EdPsych Connect is designed to provide educational services based on educational psychology principles. Our platform is intended for use by students, parents, educators, and educational professionals in accordance with UK educational standards and regulations.
                    </p>
                  </section>

                  {/* Rest of the content remains the same */}
                  {/* ... */}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
