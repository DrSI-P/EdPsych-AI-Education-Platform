'use client';

import React from 'react';
import { ParentCommunicationManagement } from '@/components/educator/parent-communication-management';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ParentCommunicationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Parent Communication Management</h1>
      
      <Tabs defaultValue="communication" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="about">About This Feature</TabsTrigger>
          <TabsTrigger value="help">Help & Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="communication">
          <ParentCommunicationManagement />
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Parent Communication Management</CardTitle>
              <CardDescription>
                Understanding how this feature helps educators communicate effectively with parents and guardians
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Parent Communication Management system is designed to streamline and enhance communication between educators and parents/guardians. This comprehensive solution reduces administrative burden while improving the quality: any, consistency, and effectiveness of home-school communication.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Key Benefits</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Communication Templates:</strong> Pre-designed, customisable templates for common communication scenarios with age-appropriate language options.
                </li>
                <li>
                  <strong>Multilingual Support:</strong> Automatic translation for communications with multilingual families, ensuring inclusive engagement.
                </li>
                <li>
                  <strong>Communication Scheduling:</strong> Integration with the Calendar Optimisation system for efficient planning and delivery of communications.
                </li>
                <li>
                  <strong>Communication History:</strong> Comprehensive record of all parent interactions with searchable archives and chronological timelines.
                </li>
                <li>
                  <strong>Secure Messaging:</strong> End-to-end encrypted communication channels with GDPR-compliant data handling.
                </li>
                <li>
                  <strong>Follow-up Management:</strong> Automated reminders for unanswered communications and tracking of parent response rates.
                </li>
                <li>
                  <strong>Parent Engagement Analytics:</strong> Visualisation of communication patterns and engagement to identify families needing additional outreach.
                </li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Educational Psychology Foundations</h3>
              <p>
                This system is grounded in established educational psychology principles including Ecological Systems Theory, which recognises the critical importance of home-school partnerships in supporting child development, and research on parental involvement that demonstrates consistent, quality communication with parents improves student outcomes.
              </p>
              
              <p className="mt-4">
                By facilitating effective communication between educators and families, this feature significantly strengthens the home-school partnership, ultimately supporting student success through collaborative approaches to education.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Help & Tips</CardTitle>
              <CardDescription>
                Guidance on getting the most from the Parent Communication Management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Getting Started</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Begin by exploring the available communication templates</li>
                <li>Customise templates to suit your specific needs and communication style</li>
                <li>Set up your recipient lists for efficient batch communications</li>
                <li>Review the analytics to understand parent engagement patterns</li>
                <li>Schedule regular communications to maintain consistent parent engagement</li>
              </ol>
              
              <h3 className="text-lg font-medium mt-4">Best Practices</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Maintain a positive tone:</strong> Focus on strengths and solutions, even when addressing concerns
                </li>
                <li>
                  <strong>Be specific and clear:</strong> Provide concrete examples and clear next steps
                </li>
                <li>
                  <strong>Respect cultural differences:</strong> Be mindful of diverse family backgrounds and communication preferences
                </li>
                <li>
                  <strong>Balance frequency:</strong> Communicate regularly without overwhelming parents
                </li>
                <li>
                  <strong>Follow up consistently:</strong> Ensure important communications receive responses
                </li>
                <li>
                  <strong>Use data wisely:</strong> Review analytics to identify engagement patterns and opportunities
                </li>
              </ul>
              
              <h3 className="text-lg font-medium mt-4">Template Usage Tips</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Always personalise templates with specific details about the student</li>
                <li>Adjust language based on the age of the student and family preferences</li>
                <li>Include specific examples when discussing student progress or concerns</li>
                <li>Offer clear, actionable suggestions for home support when appropriate</li>
                <li>End communications with an invitation for dialogue</li>
              </ul>
              
              <p className="mt-4">
                If you need additional help or have suggestions for improving this feature, please contact the platform support team.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
