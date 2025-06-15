'use client';

import dynamic from 'next/dynamic';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  GraduationCap,
  Award,
  Shield,
  Heart,
  Users,
  BookOpen,
  Target,
  Sparkles,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle
} from 'lucide-react';

function FeaturesPage() {
  const router = useRouter();
  
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessment",
      description: "Intelligent assessment tools that adapt to individual learning styles and needs."
    },
    {
      icon: GraduationCap,
      title: "Personalized Learning Paths",
      description: "Custom learning journeys tailored to each student's strengths, challenges, and interests."
    },
    {
      icon: Heart,
      title: "Emotional Wellbeing Support",
      description: "Tools and resources to monitor and support student emotional health and development."
    },
    {
      icon: Shield,
      title: "Restorative Justice Framework",
      description: "Evidence-based approaches to building positive relationships and resolving conflicts."
    },
    {
      icon: Users,
      title: "Collaborative Learning Spaces",
      description: "Digital environments that foster cooperation and peer-to-peer learning."
    },
    {
      icon: BookOpen,
      title: "Curriculum Differentiation",
      description: "Tools to adapt curriculum content for diverse learning needs and abilities."
    },
    {
      icon: Target,
      title: "Progress Monitoring",
      description: "Real-time tracking of student development across academic and social-emotional domains."
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Resources and tools available in multiple languages to support diverse communities."
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="section-accent py-16">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">Platform Features</h1>
            <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto">
              Comprehensive educational psychology tools designed to support students,
              educators, and families in creating optimal learning environments.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-section bg-secondary">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="card hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-secondary">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-section section-accent">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Ready to Transform Your Educational Experience?</h2>
          <p className="text-xl md:text-2xl text-secondary mb-8 leading-relaxed max-w-3xl mx-auto">
            Join thousands of educators, students, and families who are already benefiting
            from our comprehensive educational psychology platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-primary bg-primary hover:bg-primary-dark"
              onClick={() => router.push('/contact')}
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => router.push('/platform-overview')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Platform Overview
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FeaturesPage;
