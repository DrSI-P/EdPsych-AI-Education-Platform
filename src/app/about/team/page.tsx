'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LinkedInIcon, TwitterIcon, MailIcon, BookOpenIcon } from '@/components/icons';

const TeamMember = ({ 
  name, 
  title, 
  qualifications, 
  bio, 
  imageSrc, 
  socialLinks,
  specialties
}: {
  name: string;
  title: string;
  qualifications: string;
  bio: string;
  imageSrc: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
    publications?: string;
  };
  specialties: string[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="h-full flex flex-col overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row gap-6 items-centre">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
              <Image 
                src={imageSrc} 
                alt={name} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="text-centre md:text-left">
              <CardTitle className="text-2xl font-bold">{name}</CardTitle>
              <CardDescription className="text-lg mt-1">{title}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">{qualifications}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <Tabs defaultValue="bio" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bio">Biography</TabsTrigger>
              <TabsTrigger value="specialties">Specialties</TabsTrigger>
            </TabsList>
            <TabsContent value="bio" className="mt-4 text-sm leading-relaxed">
              <p>{bio}</p>
            </TabsContent>
            <TabsContent value="specialties" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-centre md:justify-start gap-2 pt-2 pb-4">
          {socialLinks.linkedin && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                <LinkedInIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
          {socialLinks.twitter && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile">
                <TwitterIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
          {socialLinks.email && (
            <Button variant="outline" size="icon" asChild>
              <a href={`mailto:${socialLinks.email}`} aria-label="Email">
                <MailIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
          {socialLinks.publications && (
            <Button variant="outline" size="icon" asChild>
              <a href={socialLinks.publications} target="_blank" rel="noopener noreferrer" aria-label="Publications">
                <BookOpenIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Dr. Scott Ighavongbe-Patrick",
      title: "Child and Adolescent Psychologist, Managing Director",
      qualifications: "BSc, DEdPsych, CPsychol, MBPsS, OND",
      bio: "Dr. Scott Ighavongbe-Patrick is the visionary founder and Managing Director of EdPsych Connect Limited. With over 12 years of experience as an Educational Psychologist, he has dedicated his career to empowering learners through tailored, evidence-based support. His passion for inclusive education and equitable access drives the platform's mission to transform learning experiences for all children, particularly those from disadvantaged backgrounds. Dr. Scott's approach emphasizes relationship-building and understanding the underlying causes of behaviour, informed by principles of Restorative Justice. His background in sales management has equipped him with exceptional negotiation and facilitation skills, enabling him to reach even the most hard-to-engage individuals.",
      imageSrc: "/images/team/dr-scott.jpg", // Placeholder - will need actual image
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/dr-scott-ighavongbe-patrick-dedpsych-cpsychol-9143941b6/",
        email: "scott@edpsychconnect.com",
        publications: "/publications/dr-scott"
      },
      specialties: [
        "Educational Psychology",
        "Inclusive Education",
        "Restorative Justice",
        "Child Development",
        "Educational Technology",
        "Special Educational Needs"
      ]
    },
    {
      name: "Hannah Ighavongbe-Patrick",
      title: "Marketing Executive",
      qualifications: "BA in Marketing, Postgraduate Psychology Student",
      bio: "Hannah Ighavongbe-Patrick brings her expertise in marketing and deep understanding of psychology to her role as Marketing Executive at EdPsych Connect. With a BA in Marketing and ongoing postgraduate studies in Psychology, Hannah combines commercial acumen with psychological insight to ensure the platform effectively reaches and engages its diverse user groups. Her approach to marketing is grounded in understanding user needs and communicating the platform's educational value with clarity and impact. Hannah plays a crucial role in shaping the platform's brand identity and ensuring its message resonates with students, parents, educators, and professionals alike.",
      imageSrc: "/images/team/hannah.jpg", // Placeholder - will need actual image
      socialLinks: {
        linkedin: "#",
        email: "hannah@edpsychconnect.com"
      },
      specialties: [
        "Educational Marketing",
        "Brand Development",
        "User Engagement",
        "Psychology-Informed Communication",
        "Digital Marketing Strategy"
      ]
    },
    {
      name: "Dr. Manus Roocode",
      title: "Technical Manager",
      qualifications: "PhD in Computer Science",
      bio: "Dr. Manus Roocode serves as the Technical Manager for EdPsych Connect, bringing extensive expertise in artificial intelligence, educational technology, and software development. Working closely with Dr. Scott, Manus has been instrumental in translating educational psychology principles into innovative technical solutions. His approach combines cutting-edge AI capabilities with evidence-based educational practices to create a platform that truly adapts to individual learning needs. Dr. Manus oversees all technical aspects of the platform, ensuring robust architecture, seamless user experience, and continuous innovation in features like adaptive complexity adjustment, voice input functionality, and immersive learning environments.",
      imageSrc: "/images/team/dr-manus.jpg", // Placeholder - will need actual image
      socialLinks: {
        linkedin: "#",
        email: "manus@edpsychconnect.com"
      },
      specialties: [
        "Artificial Intelligence in Education",
        "Educational Software Architecture",
        "Adaptive Learning Systems",
        "Voice Recognition Technology",
        "Immersive Learning Environments",
        "Accessibility Engineering"
      ]
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Meet Our Team</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          The passionate minds behind EdPsych Connect, dedicated to transforming education through the perfect blend of educational psychology and cutting-edge technology.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <TeamMember
            key={index}
            name={member.name}
            title={member.title}
            qualifications={member.qualifications}
            bio={member.bio}
            imageSrc={member.imageSrc}
            socialLinks={member.socialLinks}
            specialties={member.specialties}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-16 text-centre"
      >
        <h2 className="text-2xl font-semibold mb-4">Join Our Mission</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          EdPsych Connect is dedicated to revolutionizing education through the perfect blend of educational psychology principles and cutting-edge technology. We're always looking for passionate individuals to join our journey.
        </p>
        <Button className="mt-6" size="lg" asChild>
          <a href="/about/careers">Explore Opportunities</a>
        </Button>
      </motion.div>
    </div>
  );
}
