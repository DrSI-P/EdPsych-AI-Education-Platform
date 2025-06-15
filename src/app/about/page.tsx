'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Using the global NavigationMenu from layout.tsx instead of MainNavigation
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


// Original component
function AboutPage() {
  const router = useRouter();
  const achievements = [
    { icon: Award, title: "Chartered Educational Psychologist", description: "Qualified and registered professional" },
    { icon: Shield, title: "HCPC Registered: PYL042340", description: "Health and Care Professions Council" },
    { icon: GraduationCap, title: "DEdPsych BSc CPsychol MBPSs", description: "Advanced qualifications in psychology" },
    { icon: Calendar, title: "20+ Years Education Experience", description: "Extensive field experience" },
    { icon: Brain, title: "12+ Years Educational Psychology", description: "Specialized practice expertise" }
  ];

  const expertise = [
    "Child and Adolescent Educational Psychology",
    "Evidence-based Educational Interventions",
    "Restorative Justice in Educational Settings",
    "Learning Difficulties and Disabilities Assessment",
    "Behavioural Support and Intervention",
    "Family and School Collaboration",
    "Professional Development and Training",
    "Educational Research and Evaluation"
  ];

  const platformValues = [
    {
      icon: Heart,
      title: "Empowerment Through Understanding",
      description: "Every child deserves to have their unique learning needs understood and supported."
    },
    {
      icon: Users,
      title: "Inclusive Education",
      description: "Creating educational environments where all students can thrive regardless of their starting point."
    },
    {
      icon: Target,
      title: "Evidence-Based Practice",
      description: "All interventions and recommendations are grounded in robust psychological research."
    },
    {
      icon: Globe,
      title: "Accessible Support",
      description: "Making professional educational psychology support available to all who need it."
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* NavigationMenu is already in the layout */}
      
      {/* Hero Section */}
      <section className="section-accent py-16">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">About EdPsych Connect</h1>
            <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto">
              Bringing sunshine and ease to schools through evidence-based educational psychology,
              comprehensive platform tools, and restorative justice practices.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-section bg-primary">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Avatar className="w-24 h-24 mr-6 border-4 border-blue-200">
                  <AvatarImage src="/images/team/Scott.jpg" alt="Dr. Scott I-Patrick" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold">
                    DS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-2">
                    Dr. Scott I-Patrick DEdPsych BSc CPsychol MBPSs
                  </h2>
                  <p className="text-lg text-secondary">
                    Founder & Lead Educational Psychologist
                  </p>
                  <Badge className="mt-2 badge">
                    HCPC Registered: PYL042340
                  </Badge>
                </div>
              </div>
              
              <div className="prose prose-lg text-secondary">
                <p className="mb-4">
                  Dr. Scott I-Patrick is a qualified Chartered Child and Adolescent Educational Psychologist 
                  with over 20 years of experience in education and 12+ years specialising in Educational Psychology. 
                  Registered with the Health and Care Professions Council (HCPC: PYL042340), Dr. Scott brings 
                  extensive expertise in evidence-based practice and innovative educational solutions.
                </p>
                <p className="mb-4">
                  His doctoral research focuses on Restorative Justice in educational settings, exploring how 
                  relationship-building and understanding underlying causes of behavior can transform school 
                  environments. This research forms the foundation of the platform's approach to supporting 
                  both students and educators.
                </p>
                <p>
                  With a background that includes sales management, Dr. Scott brings unique negotiation and 
                  facilitation skills that help reach hard-to-reach individuals and families, ensuring that 
                  support is accessible to those who need it most.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">Professional Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 card">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">{achievement.title}</h4>
                        <p className="text-sm text-secondary">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-section section-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Meet the Team</h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Our dedicated team of educational psychology professionals committed to transforming 
              educational experiences for students, families, and educators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Dr. Scott I-Patrick */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/team/dr-scott-i-patrick-branded.jpg" 
                  alt="Dr. Scott I-Patrick" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Dr. Scott I-Patrick</h3>
              <p className="text-sm text-primary font-medium mb-2">DEdPsych BSc CPsychol MBPSs</p>
              <p className="text-sm text-secondary mb-3">Founder & Lead Educational Psychologist</p>
              <Badge className="badge text-xs">HCPC: PYL042340</Badge>
              <p className="text-xs text-muted mt-3">
                Chartered Educational Psychologist with 20+ years experience specialising in 
                evidence-based practice and restorative justice.
              </p>
            </div>

            {/* George Randall - CTO */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/team/george-randall-branded.jpg" 
                  alt="George Randall" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">George Randall</h3>
              <p className="text-sm text-indigo-600 font-medium mb-2">Chief Technology Officer (CTO)</p>
              <p className="text-sm text-gray-600 mb-3">Technical Leadership & Database Management</p>
              <Badge className="bg-indigo-100 text-indigo-800 text-xs">CTO</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Chief Technology Officer overseeing all technical aspects and database management. 
                Leads the technical architecture and ensures robust, scalable platform infrastructure 
                supporting all 200+ educational features.
              </p>
            </div>

            {/* Samantha Patrick */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/team/samantha-patrick-branded.jpg" 
                  alt="Samantha Patrick" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Samantha Patrick</h3>
              <p className="text-sm text-orange-600 font-medium mb-2">Business Admin Manager</p>
              <p className="text-sm text-gray-600 mb-3">Operations & Administration</p>
              <Badge className="bg-orange-100 text-orange-800 text-xs">Manager</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Business administration manager ensuring smooth operational excellence 
                and efficient administrative processes across all platform activities.
              </p>
            </div>

            {/* Hannah I-Patrick */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/team/hannah-i-patrick-branded.jpg" 
                  alt="Hannah I-Patrick" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hannah I-Patrick</h3>
              <p className="text-sm text-cyan-600 font-medium mb-2">Marketing Executive</p>
              <p className="text-sm text-gray-600 mb-3">Brand & Communications</p>
              <Badge className="bg-cyan-100 text-cyan-800 text-xs">Executive</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Marketing executive driving brand development and strategic communications 
                to effectively reach and engage our diverse educational community.
              </p>
            </div>

            {/* Osasogie I-Patrick */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/team/osasogie-i-patrick-branded.jpg" 
                  alt="Osasogie I-Patrick" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Osasogie I-Patrick</h3>
              <p className="text-sm text-purple-600 font-medium mb-2">Team Member</p>
              <p className="text-sm text-gray-600 mb-3">Strategic Development</p>
              <Badge className="bg-purple-100 text-purple-800 text-xs">Team Member</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Strategic team member contributing to platform development and 
                educational innovation initiatives.
              </p>
            </div>

            {/* Louis Young */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/team/louis-young-branded.jpg" 
                  alt="Louis Young" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Louis Young</h3>
              <p className="text-sm text-blue-600 font-medium mb-2">Team Member</p>
              <p className="text-sm text-gray-600 mb-3">Innovation & Development</p>
              <Badge className="bg-blue-100 text-blue-800 text-xs">Team Member</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Dynamic team member focused on innovation and platform development 
                to enhance educational experiences.
              </p>
            </div>

            {/* Professor Piers Worth */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/team/professor-piers-worth-branded.jpg" 
                  alt="Professor Piers Worth" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professor Piers Worth</h3>
              <p className="text-sm text-purple-600 font-medium mb-2">Academic Advisor</p>
              <p className="text-sm text-gray-600 mb-3">Former Head of School, Buckinghamshire New University</p>
              <Badge className="bg-purple-100 text-purple-800 text-xs">Professor Emeritus</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Distinguished retired Psychology Professor and former Head of School at Buckinghamshire 
                New University, providing senior strategic guidance and academic excellence to platform development.
              </p>
            </div>

            {/* Mrs Hayley Baverstock */}
            <div className="card text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-green-200">
                <AvatarImage src="/images/hayley-baverstock.jpg" alt="Mrs Hayley Baverstock" />
                <AvatarFallback className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-xl font-bold">
                  HB
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mrs Hayley Baverstock</h3>
              <p className="text-sm text-green-600 font-medium mb-2">Senior Specialist Advisor & Specialist Teacher</p>
              <p className="text-sm text-gray-600 mb-3">Strategic Educational Specialist</p>
              <Badge className="bg-green-100 text-green-800 text-xs">Senior Advisor</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Senior specialist advisor providing strategic guidance and expert teaching 
                methodologies. Combines high-level advisory expertise with hands-on specialist 
                teaching to support diverse educational needs and strategic development.
              </p>
            </div>

            {/* Mrs Sue Podolska */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-pink-200">
                <AvatarImage src="/images/sue-podolska.jpg" alt="Mrs Sue Podolska" />
                <AvatarFallback className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xl font-bold">
                  SP
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mrs Sue Podolska</h3>
              <p className="text-sm text-pink-600 font-medium mb-2">Senior Specialist Advisor & Specialist Teacher</p>
              <p className="text-sm text-gray-600 mb-3">SEN Inclusion Expert</p>
              <Badge className="bg-pink-100 text-pink-800 text-xs">Senior Advisor</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Senior specialist advisor providing strategic guidance for special educational needs. 
                Combines high-level advisory expertise with specialist teaching to ensure 
                comprehensive support and inclusive education for all students.
              </p>
            </div>

            {/* Samantha */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-200">
                <AvatarImage src="/images/team/Samantha.jpeg" alt="Samantha" />
                <AvatarFallback className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xl font-bold">
                  SA
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Samantha</h3>
              <p className="text-sm text-orange-600 font-medium mb-2">Business Admin Manager</p>
              <p className="text-sm text-gray-600 mb-3">Operations & Administration</p>
              <Badge className="bg-orange-100 text-orange-800 text-xs">Manager</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Business administration manager ensuring smooth operational excellence 
                and efficient administrative processes across all platform activities.
              </p>
            </div>

            {/* Hannah Patrick */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-cyan-200">
                <AvatarImage src="/images/team/Hannah.jpg" alt="Hannah Patrick" />
                <AvatarFallback className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xl font-bold">
                  HP
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hannah Patrick</h3>
              <p className="text-sm text-cyan-600 font-medium mb-2">Marketing Executive</p>
              <p className="text-sm text-gray-600 mb-3">Brand & Communications</p>
              <Badge className="bg-cyan-100 text-cyan-800 text-xs">Executive</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Marketing executive driving brand development and strategic communications 
                to effectively reach and engage our diverse educational community.
              </p>
            </div>

            {/* Osasogie Patrick */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-emerald-200">
                <AvatarImage src="/images/team/Osasogie.jpg" alt="Osasogie Patrick" />
                <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xl font-bold">
                  OP
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Osasogie Patrick</h3>
              <p className="text-sm text-emerald-600 font-medium mb-2">Business Accounts Specialist</p>
              <p className="text-sm text-gray-600 mb-3">Financial Operations</p>
              <Badge className="bg-emerald-100 text-emerald-800 text-xs">Specialist</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Business accounts specialist managing financial operations and business 
                account relationships with professional expertise and operational excellence.
              </p>
            </div>

            {/* Louis Young */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-red-200">
                <AvatarImage src="/images/team/LouisYoung.jpg" alt="Louis Young" />
                <AvatarFallback className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xl font-bold">
                  LY
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Louis Young</h3>
              <p className="text-sm text-red-600 font-medium mb-2">Sales Director</p>
              <p className="text-sm text-gray-600 mb-3">Strategic Sales Leadership</p>
              <Badge className="bg-red-100 text-red-800 text-xs">Director</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Sales director leading strategic sales initiatives and business development 
                to expand platform reach and educational impact across diverse markets.
              </p>
            </div>
          </div>

          {/* Team Values */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">Our Team Commitment</h3>
            <p className="text-lg text-secondary max-w-4xl mx-auto">
              Together, we bring decades of combined experience in educational psychology, 
              special educational needs, and innovative teaching practices. Our collaborative 
              approach ensures comprehensive support for every member of the educational community.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-section bg-primary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Areas of Expertise</h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Comprehensive educational psychology services grounded in evidence-based practice 
              and over two decades of field experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {expertise.map((area, index) => (
              <div key={index} className="p-4 bg-secondary rounded-lg border border-default hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-primary">{area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Values */}
      <section className="py-section section-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Values</h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              The principles that guide our approach to educational psychology and platform development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-primary">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-secondary">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-section section-accent">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Our Mission</h2>
          <p className="text-xl md:text-2xl text-secondary mb-8 leading-relaxed max-w-3xl mx-auto">
            To revolutionize educational support by making professional educational psychology
            accessible, evidence-based, and transformative for every child, family, and educator
            in the learning community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-primary bg-primary hover:bg-primary-dark"
              onClick={() => router.push('/contact')}
            >
              <Mail className="w-5 h-5 mr-2" />
              Get in Touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => router.push('/platform-overview')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Platform
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}



export default AboutPage;