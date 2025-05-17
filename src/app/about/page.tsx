'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("biography");

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold text-center mb-6">About Dr. Scott Ighavongbe-Patrick</h1>
        <div className="relative w-64 h-64 rounded-full overflow-hidden mb-8 border-4 border-primary shadow-lg">
          <Image 
            src="/images/dr-scott-portrait.png" 
            alt="Dr. Scott Ighavongbe-Patrick" 
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="max-w-3xl text-center">
          <p className="text-xl mb-4">
            Educational Psychologist, Visionary, and Advocate for Transformative Education
          </p>
          <p className="text-lg text-muted-foreground">
            Founder of EdPsych Connect Limited and creator of the EdPsych Connect Platform
          </p>
        </div>
      </div>

      <Tabs defaultValue="biography" className="max-w-4xl mx-auto" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="biography">Biography</TabsTrigger>
          <TabsTrigger value="vision">Vision & Mission</TabsTrigger>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="biography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Journey</CardTitle>
              <CardDescription>Over 12 years of experience as an Educational Psychologist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Dr. Scott Ighavongbe-Patrick is a dedicated Educational Psychologist with over 12 years of experience working with children, young people, and educational institutions across the UK. His professional journey has been shaped by a deep commitment to understanding the underlying causes of educational challenges and developing holistic, evidence-based solutions.
              </p>
              <p>
                Dr. Scott's background combines rigorous academic training with practical experience in educational psychology. His approach is informed by both his professional expertise and personal journey through an education system that did not always recognize or nurture individual potential.
              </p>
              <p>
                Before founding EdPsych Connect Limited, Dr. Scott worked extensively within UK educational systems, where he witnessed firsthand the challenges faced by students, particularly those from disadvantaged backgrounds or with special educational needs. This experience fueled his passion for creating more inclusive, supportive educational environments.
              </p>
              <p>
                Dr. Scott also brings valuable experience from his background in sales management, where he developed strong negotiation and facilitation skills. These abilities have proven invaluable in his work as an Educational Psychologist, particularly when reaching hard-to-engage individuals and advocating for children's needs within complex educational systems.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Philosophy</CardTitle>
              <CardDescription>Empowering learners through tailored, evidence-based support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At the heart of Dr. Scott's approach is a belief in the unique potential of every child. His personal story of resilience informs his commitment to creating educational environments where all students can thrive, regardless of their background or abilities.
              </p>
              <p>
                Dr. Scott is a passionate advocate for inclusive education and equitable access, particularly for disadvantaged children and young people. He emphasizes the importance of relationship-building and understanding the underlying causes of behavior, drawing on frameworks such as Restorative Justice.
              </p>
              <p>
                His educational philosophy centers on four key pillars: creativity, inclusion, emotional well-being, and student agency. Dr. Scott believes that by honoring these principles, education can become a transformative rather than transactional experience.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>The EdPsych Connect Vision</CardTitle>
              <CardDescription>Revolutionizing learning through personalization and engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Dr. Scott's vision for EdPsych Connect is to revolutionize learning through personalized learning paths based on individual starting points, systematic curriculum coverage to minimize learning gaps, identification of learning styles, and content adaptation based on children's interests to maximize motivation and engagement.
              </p>
              <p>
                The EdPsych Connect platform represents the culmination of Dr. Scott's research, experience, and vision. It aims to be the nucleus of every school, bringing together evidence-based approaches to support both students and teachers in creating more effective, engaging, and emotionally supportive learning environments.
              </p>
              <p>
                Central to this vision is the belief that technology should serve to enhance human connections rather than replace them. The platform is designed to reduce administrative burdens on teachers, freeing them to focus on relationship-building and quality teaching—the aspects of education that make the most difference in children's lives.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mission and Impact</CardTitle>
              <CardDescription>Creating educational environments where every child can thrive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Dr. Scott's mission is to transform educational experiences for all children, with particular attention to those who struggle in traditional settings. He is committed to creating systems that listen to and honor children's voices, in alignment with Article 12 of the United Nations Convention on the Rights of the Child.
              </p>
              <p>
                Through the EdPsych Connect platform, Dr. Scott aims to address critical challenges in education, including school anxiety leading to emotionally-based school non-attendance, teacher burnout due to administrative burdens, and the lack of differentiated curriculum that meets individual learning needs.
              </p>
              <p>
                The ultimate goal is to create educational environments where students enjoy coming to school, teachers have time for meaningful relationships with their students, and learning is personalized, engaging, and future-focused. Dr. Scott envisions a world where no child leaves school worse off than when they entered—where education truly fulfills its potential as a transformative force in children's lives.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expertise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
              <CardDescription>Specialized knowledge and evidence-based approaches</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Educational Psychology and Child Development</li>
                <li>Special Educational Needs and Disabilities (SEND)</li>
                <li>Emotionally-Based School Non-Attendance</li>
                <li>Restorative Justice in Educational Settings</li>
                <li>Attachment Theory and Its Applications in Schools</li>
                <li>Personalized Learning and Curriculum Differentiation</li>
                <li>Social-Emotional Learning and Well-being</li>
                <li>Educational Technology and AI in Learning</li>
                <li>Inclusive Education Practices</li>
                <li>Teacher Professional Development</li>
                <li>Educational Assessment and Intervention</li>
                <li>Student Voice and Empowerment</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theoretical Frameworks</CardTitle>
              <CardDescription>Evidence-based models that inform Dr. Scott's approach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Dr. Scott's work is informed by several key theoretical frameworks, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Restorative Justice:</strong> Creating emotionally safe environments through dialogue and mutual understanding</li>
                <li><strong>Humanistic Theories:</strong> Focusing on the whole person and their potential for growth</li>
                <li><strong>Tomkins' Theory of Affect Script:</strong> Understanding emotional responses and development</li>
                <li><strong>Nathanson's Compass of Shame:</strong> Addressing shame-based responses in educational settings</li>
                <li><strong>Universal Design for Learning (UDL):</strong> Adapting instruction to meet the needs of all learners</li>
                <li><strong>Zone of Proximal Development:</strong> Supporting learning through appropriate scaffolding</li>
                <li><strong>Attachment Theory:</strong> Understanding the impact of relationships on learning and development</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Doctoral Research</CardTitle>
              <CardDescription>Systematic review of children's voices in education</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Dr. Scott's doctoral thesis represents a significant contribution to the field of educational psychology. Through a systematic review spanning 25 years of research, he captured and analyzed the voices of children in educational settings, with particular attention to those who had been excluded from school.
              </p>
              <p>
                This research highlighted the critical importance of listening to children's perspectives and acting on their input—not just hearing them. It demonstrated that when children's voices are valued and incorporated into educational decisions, outcomes improve across multiple dimensions.
              </p>
              <p>
                The findings from this research directly inform the design and functionality of the EdPsych Connect platform, particularly its emphasis on student voice, agency, and personalized approaches to learning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Book</CardTitle>
              <CardDescription>"Restoring Genius: How Education Can Nurture Every Child's Unique Path"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Dr. Scott is currently working on a comprehensive book titled "Restoring Genius: How Education Can Nurture Every Child's Unique Path." This work explores how educators, parents, and policymakers can create more inclusive, empowering, and emotionally supportive learning environments.
              </p>
              <p>
                The book challenges traditional assumptions about education and advocates for a model that values creativity, inclusion, emotional well-being, and student agency. It offers practical strategies based on evidence-based frameworks such as Restorative Justice, Humanistic Theories, and models of emotional development.
              </p>
              <p>
                "Restoring Genius" represents the culmination of Dr. Scott's research and experience, providing a blueprint for transforming educational practices to better serve all children, particularly those who have been marginalized or underserved by traditional approaches.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Resources</CardTitle>
              <CardDescription>Practical guides and educational materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                In addition to his academic work, Dr. Scott has developed numerous professional resources for educators, parents, and educational psychologists. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>"Supporting Children with Attachment Needs" - A comprehensive guide for educators</li>
                <li>"The Biological Basis of Emotions" - Educational resource on emotional development</li>
                <li>Assessment frameworks and protocols for educational psychologists</li>
                <li>Intervention guides for supporting children with specific needs</li>
                <li>Professional development materials for teachers and school staff</li>
              </ul>
              <p>
                These resources reflect Dr. Scott's commitment to translating research into practical tools that can make a real difference in educational settings. Many of these materials are incorporated into the EdPsych Connect platform, making evidence-based approaches accessible to a wider audience.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-10">
        <Button size="lg" className="mr-4">Contact Dr. Scott</Button>
        <Button size="lg" variant="outline">Learn More About EdPsych Connect</Button>
      </div>
    </div>
  );
}
