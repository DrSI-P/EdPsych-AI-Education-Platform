'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Accessibility, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  Monitor,
  Smartphone,
  Keyboard,
  Eye,
  Volume2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
// Original component

const AIEnhancedLayout = dynamic(
  () => import('@/components/layouts/AIEnhancedLayout'),
  { ssr: false }
);

function AccessibilityPage() {
  return (
    <AIEnhancedLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Accessibility className="h-8 w-8 text-primary mr-3" />
          <Heading level="h1">Accessibility Statement</Heading>
        </div>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Commitment to Accessibility</Heading>
          <Text className="mb-4">
            EdPsych AI is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all users.
          </Text>
          
          <Text className="mb-4">
            Our goal is to create an inclusive environment where all users, regardless of ability or technology, can effectively use our platform. This commitment extends to all aspects of our service, including our website, mobile applications, and educational content.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Conformance Status</Heading>
          <Text className="mb-4">
            The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </Text>
          
          <div className="flex items-center mb-4">
            <CheckCircle className="text-green-500 mr-2 h-6 w-6 flex-shrink-0" />
            <Text className="font-medium">
              EdPsych AI strives to conform to WCAG 2.1 Level AA standards.
            </Text>
          </div>
          
          <Text className="mb-4">
            We regularly test our platform using a combination of automated tools and manual testing by users with disabilities to ensure we meet or exceed these standards. Our accessibility compliance is an ongoing process, and we are committed to regular testing and improvements.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Accessibility Features</Heading>
          <Text className="mb-4">
            The EdPsych AI Platform includes the following accessibility features:
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Keyboard className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Keyboard Navigation</Heading>
              </div>
              <Text>
                All platform functionality is operable through a keyboard interface without requiring specific timings for individual keystrokes.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Screen Reader Compatibility</Heading>
              </div>
              <Text>
                Our platform is compatible with popular screen readers including JAWS, NVDA, VoiceOver, and TalkBack.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Monitor className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Text Resizing</Heading>
              </div>
              <Text>
                Text can be resized up to 200% without loss of content or functionality, and without requiring horizontal scrolling.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Volume2 className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Audio Descriptions</Heading>
              </div>
              <Text>
                Audio descriptions are provided for all pre-recorded video content to ensure users with visual impairments can access visual information.
              </Text>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Smartphone className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Responsive Design</Heading>
              </div>
              <Text>
                Our platform is designed to be responsive and accessible across various devices and screen sizes.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Color Contrast</Heading>
              </div>
              <Text>
                We maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text to ensure readability.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Closed Captions</Heading>
              </div>
              <Text>
                Closed captions are provided for all pre-recorded audio content to ensure users with hearing impairments can access audio information.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Accessibility className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Accessible Forms</Heading>
              </div>
              <Text>
                All form elements have appropriate labels, error messages are clearly identified, and form validation provides clear guidance.
              </Text>
            </div>
          </div>
          
          <Text className="mb-4">
            These features are continuously monitored and improved to ensure they meet the needs of all users.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8 border-amber-500">
          <div className="flex items-start mb-4">
            <AlertTriangle className="text-amber-500 mr-2 h-6 w-6 flex-shrink-0" />
            <Heading level="h2">Known Limitations</Heading>
          </div>
          
          <Text className="mb-4">
            Despite our efforts to ensure accessibility, there may be some limitations:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Some older PDF documents may not be fully accessible. We are working to remediate these documents.</Text>
            </li>
            <li>
              <Text>Some third-party content or applications that are embedded within our platform may not be fully accessible. We are working with our partners to address these issues.</Text>
            </li>
            <li>
              <Text>Certain interactive educational simulations may have limited accessibility. Alternative accessible versions or equivalent learning experiences are provided where possible.</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            We are actively working to resolve these limitations and improve the accessibility of our platform. If you encounter any accessibility barriers not listed here, please contact us using the feedback form below.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Technology Used</Heading>
          <Text className="mb-4">
            The EdPsych AI Platform relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>HTML5</Text>
            </li>
            <li>
              <Text>WAI-ARIA</Text>
            </li>
            <li>
              <Text>CSS3</Text>
            </li>
            <li>
              <Text>JavaScript/React</Text>
            </li>
            <li>
              <Text>SVG</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            These technologies are relied upon for conformance with the accessibility standards used.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Assessment Methods</Heading>
          <Text className="mb-4">
            EdPsych AI assesses the accessibility of our platform through the following methods:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text><span className="font-semibold">Self-evaluation:</span> Our development team conducts regular accessibility reviews using automated tools and manual testing.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">External audits:</span> We engage third-party accessibility experts to conduct comprehensive audits of our platform.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">User testing:</span> We conduct usability testing with users who have various disabilities and use assistive technologies.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Ongoing monitoring:</span> We use automated tools to continuously monitor our platform for accessibility issues.</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            The results of these assessments are used to identify and prioritize accessibility improvements.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Feedback Mechanism</Heading>
          <Text className="mb-4">
            We welcome your feedback on the accessibility of the EdPsych AI Platform. Please let us know if you encounter any accessibility barriers or have suggestions for improvement:
          </Text>
          
          <div className="bg-muted p-4 rounded-md mb-6">
            <ul className="space-y-2">
              <li className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <Text>Email: accessibility@edpsychai.com</Text>
              </li>
              <li className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                <Text>Phone: (555) 123-4567</Text>
              </li>
            </ul>
          </div>
          
          <Text className="mb-6">
            We aim to respond to all feedback within 2 business days. Your input helps us identify areas where we can improve the accessibility of our platform.
          </Text>
          
          <div className="flex justify-center">
            <Button className="mr-4" asChild>
              <Link href="/accessibility-feedback">
                Submit Accessibility Feedback
              </Link>
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Formal Complaints</Heading>
          <Text className="mb-4">
            We are committed to providing equal access and opportunity to individuals with disabilities. If you believe we have failed to meet this commitment, you can file a formal complaint:
          </Text>
          
          <ol className="list-decimal pl-8 mb-4 space-y-2">
            <li>
              <Text>Contact our Accessibility Coordinator at accessibility@edpsychai.com with the subject line "Formal Accessibility Complaint"</Text>
            </li>
            <li>
              <Text>Provide a detailed description of the accessibility issue, including the page or feature where you encountered the problem</Text>
            </li>
            <li>
              <Text>Include your contact information so we can follow up with you</Text>
            </li>
          </ol>
          
          <Text className="mb-4">
            We will investigate your complaint and provide a response within 10 business days. If you are not satisfied with our response, you may escalate your complaint to the appropriate regulatory authority.
          </Text>
        </Card>
        
        <Card className="p-6">
          <Heading level="h2" className="mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" /> Updates to This Statement
          </Heading>
          
          <Text className="mb-4">
            This Accessibility Statement was last updated on June 7, 2025. We will regularly review and update this statement as our platform evolves and as we implement accessibility improvements.
          </Text>
          
          <Text className="mb-4">
            We encourage you to review this statement periodically for any changes. Significant changes will be clearly communicated through our platform.
          </Text>
          
          <div className="bg-muted p-4 rounded-md">
            <Text className="font-medium">Last Updated: June 7, 2025</Text>
          </div>
        </Card>
      </div>
    </AIEnhancedLayout>
  );
}


export default AccessibilityPage;