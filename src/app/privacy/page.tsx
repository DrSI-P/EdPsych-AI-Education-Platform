'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * Privacy Policy Page
 * 
 * This component implements the missing Privacy Policy page with GDPR-compliant content.
 * It was identified as a missing page that would cause 404 errors when linked from the landing page.
 */
export default function PrivacyPolicy() {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  useEffect(() => {
    // Set the last updated date to today's date in UK format
    const today = new Date();
    setLastUpdated(today.toLocaleDateString('en-GB'));
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="text-sm text-muted-foreground mb-8">
        Last Updated: {lastUpdated}
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
          <CardDescription>
            Our commitment to your privacy and data protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            EdPsych Connect Limited ("we", "our", "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our educational platform.
          </p>
          <p className="mb-4">
            We are committed to complying with the General Data Protection Regulation (GDPR), the Data Protection Act 2018, and all applicable UK data protection legislation.
          </p>
          <p>
            This policy applies to all users of the EdPsych-AI Education Platform, including children, young people, parents, teachers, and educational professionals.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
          <CardDescription>
            Types of data we collect and process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <p className="mb-4">
            We may collect the following personal information:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Name and contact details</li>
            <li>Date of birth</li>
            <li>Educational institution information</li>
            <li>Login credentials</li>
            <li>Profile information</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-2">Educational Data</h3>
          <p className="mb-4">
            We collect educational data to provide personalized learning experiences:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Learning progress and achievements</li>
            <li>Assessment results</li>
            <li>Learning preferences and styles</li>
            <li>Interaction with educational content</li>
            <li>Feedback and responses to activities</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-2">Technical Data</h3>
          <p className="mb-4">
            We collect technical information about your device and usage:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Usage statistics and patterns</li>
            <li>Cookies and similar technologies</li>
          </ul>
          
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Special Category Data</AlertTitle>
            <AlertDescription>
              We may collect special category data such as information about special educational needs or disabilities, but only with appropriate consent and safeguards in place.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
          <CardDescription>
            Purposes for which we process your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We use your information for the following purposes:
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Providing Educational Services</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Delivering personalized learning experiences</li>
            <li>Adapting content to learning styles and needs</li>
            <li>Tracking educational progress</li>
            <li>Providing feedback and assessments</li>
            <li>Supporting special educational needs</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-2">Platform Administration</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Account management and authentication</li>
            <li>Technical support and troubleshooting</li>
            <li>Platform maintenance and improvement</li>
            <li>Security and fraud prevention</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-2">Research and Development</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Improving educational methodologies</li>
            <li>Enhancing platform features and usability</li>
            <li>Developing new educational tools</li>
            <li>Anonymized statistical analysis</li>
          </ul>
          
          <p className="font-medium">
            We will only use your personal information for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason compatible with the original purpose.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Legal Basis for Processing</CardTitle>
          <CardDescription>
            How we justify our data processing activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We process your personal data on the following legal bases:
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Consent</h3>
          <p className="mb-4">
            Where you have given explicit consent for us to process your personal data for specific purposes, such as sending marketing communications or collecting special category data.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Contract</h3>
          <p className="mb-4">
            Where processing is necessary for the performance of a contract with you, such as providing access to the platform and its features.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Legitimate Interests</h3>
          <p className="mb-4">
            Where processing is necessary for our legitimate interests, such as improving our services, ensuring platform security, and conducting research to enhance educational outcomes.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Legal Obligation</h3>
          <p className="mb-4">
            Where processing is necessary to comply with a legal obligation, such as safeguarding requirements for educational platforms.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Public Interest</h3>
          <p>
            Where processing is necessary for the performance of a task carried out in the public interest, such as providing educational services.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Sharing and Transfers</CardTitle>
          <CardDescription>
            How and when we share your information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We may share your personal information with:
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Educational Institutions</h3>
          <p className="mb-4">
            Schools, academies, and other educational institutions that use our platform to support their students' learning.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Service Providers</h3>
          <p className="mb-4">
            Third-party service providers who perform services on our behalf, such as hosting, data analysis, payment processing, and customer service.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Legal Requirements</h3>
          <p className="mb-4">
            We may disclose your information if required to do so by law or in response to valid requests by public authorities.
          </p>
          
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>International Transfers</AlertTitle>
            <AlertDescription>
              We ensure that any international transfers of your data are protected by appropriate safeguards, such as standard contractual clauses or adequacy decisions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Security</CardTitle>
          <CardDescription>
            How we protect your information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We have implemented appropriate technical and organizational measures to protect your personal information, including:
          </p>
          
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments and audits</li>
            <li>Access controls and authentication procedures</li>
            <li>Staff training on data protection</li>
            <li>Incident response procedures</li>
          </ul>
          
          <p>
            While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Rights</CardTitle>
          <CardDescription>
            Understanding your data protection rights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Under data protection laws, you have the following rights:
          </p>
          
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Right to Access</strong> - You can request a copy of your personal data.</li>
            <li><strong>Right to Rectification</strong> - You can ask us to correct inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure</strong> - You can ask us to delete your personal data in certain circumstances.</li>
            <li><strong>Right to Restrict Processing</strong> - You can ask us to limit the processing of your data.</li>
            <li><strong>Right to Data Portability</strong> - You can request the transfer of your data to another organization.</li>
            <li><strong>Right to Object</strong> - You can object to the processing of your personal data.</li>
            <li><strong>Rights Related to Automated Decision Making</strong> - You can request human intervention in automated decisions.</li>
          </ul>
          
          <p className="mb-4">
            To exercise any of these rights, please contact us using the details provided below. We will respond to your request within one month.
          </p>
          
          <p>
            You also have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Children's Privacy</CardTitle>
          <CardDescription>
            Special protections for children's data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our platform is designed for use by children and young people in educational settings. We take additional measures to protect children's privacy:
          </p>
          
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>We obtain appropriate consent from parents or guardians for users under 13</li>
            <li>We collect only the minimum data necessary to provide educational services</li>
            <li>We use age-appropriate language in our privacy communications</li>
            <li>We implement enhanced security measures for children's data</li>
            <li>We do not use children's data for marketing purposes</li>
          </ul>
          
          <p>
            If you believe we have collected personal information from a child without appropriate consent, please contact us immediately.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cookies and Similar Technologies</CardTitle>
          <CardDescription>
            How we use cookies on our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We use cookies and similar technologies to enhance your experience on our platform:
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
          <p className="mb-4">
            These cookies are necessary for the platform to function and cannot be switched off. They are usually set in response to actions you take, such as logging in or filling in forms.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Functional Cookies</h3>
          <p className="mb-4">
            These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Analytical Cookies</h3>
          <p className="mb-4">
            These cookies help us understand how visitors interact with our platform, allowing us to improve functionality and user experience.
          </p>
          
          <p>
            You can manage your cookie preferences through your browser settings. However, disabling certain cookies may affect the functionality of the platform.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
          <CardDescription>
            How long we keep your information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including:
          </p>
          
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Providing educational services</li>
            <li>Maintaining educational records as required by law</li>
            <li>Resolving disputes</li>
            <li>Enforcing our agreements</li>
            <li>Complying with legal obligations</li>
          </ul>
          
          <p>
            When personal data is no longer needed, we will securely delete or anonymize it.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Changes to This Privacy Policy</CardTitle>
          <CardDescription>
            How we update our privacy practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by:
          </p>
          
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Posting a notice on our platform</li>
            <li>Sending an email notification</li>
            <li>Updating the "Last Updated" date at the top of this policy</li>
          </ul>
          
          <p>
            We encourage you to review this Privacy Policy periodically to stay informed about our data practices.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            How to reach us with privacy questions or concerns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          
          <div className="mb-4">
            <p className="font-medium">EdPsych Connect Limited</p>
            <p>Data Protection Officer</p>
            <p>Email: privacy@edpsychconnect.com</p>
            <p>Address: [Company Address]</p>
            <p>Phone: [Company Phone]</p>
          </div>
          
          <p>
            We are committed to working with you to obtain a fair resolution of any complaint or concern about privacy.
          </p>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <Label htmlFor="email" className="mb-2 block">Subscribe to Privacy Policy Updates</Label>
            <div className="flex gap-2">
              <Input id="email" placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
