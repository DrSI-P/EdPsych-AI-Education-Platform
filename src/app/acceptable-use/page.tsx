'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileText, 
  AlertTriangle,
  Clock,
  Mail,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  Users
} from 'lucide-react';
import Link from 'next/link';
// Original component

const AIEnhancedLayout = dynamic(
  () => import('@/components/layouts/AIEnhancedLayout'),
  { ssr: false }
);

function AcceptableUsePage() {
  return (
    <AIEnhancedLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <Heading level="h1">Acceptable Use Policy</Heading>
        </div>
        
        <Text className="text-xl mb-8">
          This Acceptable Use Policy outlines the guidelines and requirements for using the EdPsych AI Platform. By accessing or using our platform, you agree to comply with this policy.
        </Text>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Acceptable Use Overview</Heading>
          
          <Text className="mb-4">
            EdPsych AI is designed to support educational activities and enhance teaching and learning experiences. The platform should be used in a manner that is consistent with its educational purpose and in compliance with all applicable laws and regulations.
          </Text>
          
          <Text className="mb-4">
            This policy applies to all users of the EdPsych AI Platform, including but not limited to educators, students, parents, administrators, and any other individuals or entities with access to the platform.
          </Text>
          
          <Text className="mb-4">
            By using the EdPsych AI Platform, you acknowledge that you have read, understood, and agree to abide by this Acceptable Use Policy. If you do not agree with any part of this policy, you should discontinue use of the platform immediately.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" /> Acceptable Uses
          </Heading>
          
          <Text className="mb-4">
            The EdPsych AI Platform may be used for:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Educational purposes related to teaching, learning, and assessment</Text>
            </li>
            <li>
              <Text>Creating, accessing, and sharing educational content and resources</Text>
            </li>
            <li>
              <Text>Communicating with other users for educational purposes</Text>
            </li>
            <li>
              <Text>Analysing student performance and progress data to inform instruction</Text>
            </li>
            <li>
              <Text>Professional development and training for educators</Text>
            </li>
            <li>
              <Text>Administrative tasks related to educational activities</Text>
            </li>
            <li>
              <Text>Research activities that have received appropriate approvals and consent</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            Educational institutions may establish additional acceptable use guidelines that complement this policy.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" /> Prohibited Activities
          </Heading>
          
          <Text className="mb-4">
            The following activities are strictly prohibited when using the EdPsych AI Platform:
          </Text>
          
          <div className="space-y-4 mb-4">
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Illegal Activities</Heading>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text>Violating any applicable local, national, or international law or regulation</Text>
                </li>
                <li>
                  <Text>Engaging in any activity that is fraudulent, deceptive, or misleading</Text>
                </li>
                <li>
                  <Text>Attempting to gain unauthorised access to the platform or related systems</Text>
                </li>
                <li>
                  <Text>Interfering with or disrupting the integrity or performance of the platform</Text>
                </li>
              </ul>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Content Violations</Heading>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text>Uploading, posting, or sharing content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of privacy, or otherwise objectionable</Text>
                </li>
                <li>
                  <Text>Creating or sharing content that promotes discrimination, bigotry, racism, hatred, or physical harm against any individual or group</Text>
                </li>
                <li>
                  <Text>Uploading, posting, or sharing content that infringes upon intellectual property rights, including copyrights, trademarks, patents, or trade secrets</Text>
                </li>
                <li>
                  <Text>Creating or sharing content that contains personal, sensitive, or confidential information about others without appropriate consent</Text>
                </li>
              </ul>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">System Abuse</Heading>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text>Attempting to probe, scan, or test the vulnerability of the platform or any associated system or network</Text>
                </li>
                <li>
                  <Text>Introducing malware, viruses, trojan horses, worms, logic bombs, or other harmful materials into the platform</Text>
                </li>
                <li>
                  <Text>Using automated scripts, bots, or other means to access, scrape, or interact with the platform</Text>
                </li>
                <li>
                  <Text>Attempting to circumvent any security measures or access restrictions</Text>
                </li>
                <li>
                  <Text>Overwhelming or flooding the platform with excessive requests or traffic</Text>
                </li>
              </ul>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Misuse of AI Features</Heading>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text>Using AI features to generate inappropriate, harmful, or misleading content</Text>
                </li>
                <li>
                  <Text>Attempting to manipulate AI systems to bypass content filters or safety measures</Text>
                </li>
                <li>
                  <Text>Using AI-generated content for plagiarism or academic dishonesty</Text>
                </li>
                <li>
                  <Text>Exploiting AI features for non-educational purposes</Text>
                </li>
              </ul>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Commercial Misuse</Heading>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text>Using the platform for commercial purposes not explicitly authorised by EdPsych AI</Text>
                </li>
                <li>
                  <Text>Selling, renting, or leasing access to the platform</Text>
                </li>
                <li>
                  <Text>Using platform content or data for commercial advantage</Text>
                </li>
                <li>
                  <Text>Advertising or soliciting for products or services unrelated to the platform's educational purpose</Text>
                </li>
              </ul>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" /> User Contributions
          </Heading>
          
          <Text className="mb-4">
            Users may contribute content to the EdPsych AI Platform, including but not limited to lesson plans, assessments, educational resources, comments, and feedback. All user contributions must:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Be appropriate for an educational environment</Text>
            </li>
            <li>
              <Text>Respect the intellectual property rights of others</Text>
            </li>
            <li>
              <Text>Be accurate and not misleading</Text>
            </li>
            <li>
              <Text>Comply with all applicable laws and regulations</Text>
            </li>
            <li>
              <Text>Adhere to the guidelines set forth in this Acceptable Use Policy</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            By contributing content to the platform, you represent and warrant that:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>You own or have the necessary rights to the content you contribute</Text>
            </li>
            <li>
              <Text>Your contributions do not violate the privacy rights, publicity rights, intellectual property rights, or any other rights of any person or entity</Text>
            </li>
            <li>
              <Text>Your contributions do not contain any material that solicits personal information from anyone under the age of 18 or exploits people under the age of 18 in a sexual or violent manner</Text>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2" /> Content Standards
          </Heading>
          
          <Text className="mb-4">
            All content on the EdPsych AI Platform, whether created by users or generated by AI, must adhere to the following standards:
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                <Heading level="h3" className="text-lg">Educational Value</Heading>
              </div>
              <Text>
                Content should have clear educational value and be relevant to teaching, learning, or educational administration.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                <Heading level="h3" className="text-lg">Accuracy</Heading>
              </div>
              <Text>
                Content should be factually accurate and not misleading. Sources should be cited where appropriate.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                <Heading level="h3" className="text-lg">Age-Appropriate</Heading>
              </div>
              <Text>
                Content should be appropriate for the intended age group and educational context.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                <Heading level="h3" className="text-lg">Respectful</Heading>
              </div>
              <Text>
                Content should respect diversity and be free from discriminatory, offensive, or harmful material.
              </Text>
            </div>
          </div>
          
          <Text className="mb-4">
            EdPsych AI reserves the right to remove any content that does not comply with these standards.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" /> Communication Guidelines
          </Heading>
          
          <Text className="mb-4">
            The EdPsych AI Platform includes communication features that allow users to interact with each other. When using these features, users must:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Communicate in a respectful and professional manner</Text>
            </li>
            <li>
              <Text>Use appropriate language for an educational environment</Text>
            </li>
            <li>
              <Text>Respect the privacy and boundaries of other users</Text>
            </li>
            <li>
              <Text>Use communication features only for educational purposes</Text>
            </li>
            <li>
              <Text>Report any inappropriate communications to platform administrators</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            Educational institutions may implement additional communication guidelines and monitoring procedures to ensure safe and appropriate use of communication features.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" /> Monitoring and Enforcement
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI monitors platform usage to ensure compliance with this Acceptable Use Policy. We employ both automated systems and human review to detect and address policy violations.
          </Text>
          
          <Text className="mb-4">
            Enforcement actions may include:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Issuing warnings to users who violate the policy</Text>
            </li>
            <li>
              <Text>Temporarily suspending access to specific features or the entire platform</Text>
            </li>
            <li>
              <Text>Permanently terminating user accounts for serious or repeated violations</Text>
            </li>
            <li>
              <Text>Removing content that violates this policy</Text>
            </li>
            <li>
              <Text>Reporting illegal activities to appropriate authorities</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            For school-based accounts, we may notify school administrators of policy violations by their users.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" /> Reporting Violations
          </Heading>
          
          <Text className="mb-4">
            If you observe content or behavior that violates this Acceptable Use Policy, please report it immediately. You can report violations by:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Using the "Report" feature available throughout the platform</Text>
            </li>
            <li>
              <Text>Contacting your school administrator (for school-based accounts)</Text>
            </li>
            <li>
              <Text>Emailing our support team at support@edpsychai.com</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            Please provide as much detail as possible when reporting violations, including:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>The nature of the violation</Text>
            </li>
            <li>
              <Text>Where and when it occurred</Text>
            </li>
            <li>
              <Text>Who was involved (if known)</Text>
            </li>
            <li>
              <Text>Any supporting evidence or information</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            We take all reports seriously and will investigate promptly. Your identity will be kept confidential to the extent permitted by law.
          </Text>
          
          <div className="flex justify-center">
            <Button className="mr-4" asChild>
              <Link href="/report-violation">
                Report a Violation
              </Link>
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" /> Consequences of Violations
          </Heading>
          
          <Text className="mb-4">
            Violations of this Acceptable Use Policy may result in consequences including but not limited to:
          </Text>
          
          <ol className="list-decimal pl-8 mb-4 space-y-2">
            <li>
              <Text><span className="font-semibold">Warning:</span> For minor or first-time violations, users may receive a warning explaining the violation and how to correct it.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Temporary Suspension:</span> Access to specific features or the entire platform may be temporarily suspended for more serious violations or repeated minor violations.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Content Removal:</span> Content that violates this policy will be removed from the platform.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Account Termination:</span> Accounts may be permanently terminated for severe violations or a pattern of repeated violations.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Legal Action:</span> In cases involving illegal activities, EdPsych AI may report the violation to appropriate legal authorities and cooperate with any resulting investigation.</Text>
            </li>
          </ol>
          
          <Text className="mb-4">
            For school-based accounts, consequences may also include notification to school administrators, who may impose additional consequences according to school policies.
          </Text>
        </Card>
        
        <Card className="p-6">
          <Heading level="h2" className="mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" /> Changes to This Policy
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI may update this Acceptable Use Policy from time to time to reflect changes in our practices, the platform's features, or legal requirements. We will notify users of any significant changes through the platform and/or email.
          </Text>
          
          <Text className="mb-4">
            Continued use of the platform after changes to this policy constitutes acceptance of the updated policy. We encourage users to review this policy periodically to stay informed about our acceptable use requirements.
          </Text>
          
          <div className="bg-muted p-4 rounded-md mb-4">
            <Text className="font-medium">Last Updated: 7 June 2025</Text>
          </div>
          
          <Text className="mb-4">
            If you have any questions about this Acceptable Use Policy, please contact us at:
          </Text>
          
          <div className="bg-muted p-4 rounded-md mb-4">
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2" />
              <Text>support@edpsychai.com</Text>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </AIEnhancedLayout>
  );
}

export default AcceptableUsePage;