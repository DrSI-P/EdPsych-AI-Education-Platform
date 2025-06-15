'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Mail, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
// Original component

const AIEnhancedLayout = dynamic(
  () => import('@/components/layouts/AIEnhancedLayout'),
  { ssr: false }
);

function CopyrightPage() {
  return (
    <AIEnhancedLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <Heading level="h1" className="mb-6">Copyright Notice</Heading>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Copyright Statement</Heading>
          <Text className="mb-4">
            © 2025 EdPsych AI. All rights reserved. The content, design, graphics, and other materials related to the EdPsych AI Platform are protected by copyright laws and may not be copied, reproduced, distributed, published, displayed, modified, or used in any form without the prior written permission of EdPsych AI.
          </Text>
          
          <Text className="mb-4">
            The EdPsych AI name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of EdPsych AI or its affiliates. You may not use such marks without the prior written permission of EdPsych AI.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Ownership of Content</Heading>
          <Text className="mb-4">
            The EdPsych AI Platform contains proprietary content, including but not limited to text, software, graphics, photos, videos, and other material, which is owned by EdPsych AI or its licensors and is protected by copyright and other intellectual property laws.
          </Text>
          
          <Heading level="h3" className="mt-6 mb-2">Platform Content</Heading>
          <Text className="mb-4">
            All content provided through the EdPsych AI Platform, including AI-generated content, lesson plans, assessments, educational resources, and analytics, is owned by EdPsych AI unless explicitly stated otherwise.
          </Text>
          
          <Heading level="h3" className="mt-6 mb-2">Licensed Content</Heading>
          <Text className="mb-4">
            Some content available through the EdPsych AI Platform may be licensed from third parties. This content is subject to the terms of the respective licenses and may have additional usage restrictions.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">User-Generated Content</Heading>
          <Text className="mb-4">
            Users of the EdPsych AI Platform may create, upload, or share content ("User Content"). By submitting User Content to the platform, you grant EdPsych AI a worldwide, non-exclusive, royalty-free licence to use, reproduce, modify, adapt, publish, translate, and distribute such content in connection with providing and promoting the EdPsych AI Platform.
          </Text>
          
          <Text className="mb-4">
            You represent and warrant that:
          </Text>
          
          <ul className="list-disc pl-8 mb-4">
            <li className="mb-2">You own or have the necessary rights to the User Content you submit</li>
            <li className="mb-2">The User Content does not infringe upon the intellectual property rights of any third party</li>
            <li className="mb-2">The User Content complies with these terms and all applicable laws and regulations</li>
          </ul>
          
          <Text className="mb-4">
            EdPsych AI respects the intellectual property rights of others and expects users to do the same. EdPsych AI reserves the right to remove any User Content that may infringe the rights of third parties.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Fair Use Policy</Heading>
          <Text className="mb-4">
            EdPsych AI recognizes the doctrine of fair use as established in Section 107 of the U.S. Copyright Act. Users may use limited portions of copyrighted materials for purposes such as criticism, comment, news reporting, teaching, scholarship, or research, subject to the following factors:
          </Text>
          
          <ul className="list-disc pl-8 mb-4">
            <li className="mb-2">The purpose and character of the use, including whether it is commercial or nonprofit educational</li>
            <li className="mb-2">The nature of the copyrighted work</li>
            <li className="mb-2">The amount and substantiality of the portion used in relation to the copyrighted work as a whole</li>
            <li className="mb-2">The effect of the use upon the potential market for or value of the copyrighted work</li>
          </ul>
          
          <Text className="mb-4">
            Educational use does not automatically qualify as fair use. Users are responsible for ensuring their use of materials complies with copyright law.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8 border-amber-500">
          <div className="flex items-start mb-4">
            <AlertTriangle className="text-amber-500 mr-2 h-6 w-6 flex-shrink-0" />
            <Heading level="h2">Digital Millennium Copyright Act (DMCA) Policy</Heading>
          </div>
          
          <Text className="mb-4">
            EdPsych AI respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (DMCA). If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please submit a notification pursuant to the DMCA by providing our Copyright Agent with the following information in writing:
          </Text>
          
          <ol className="list-decimal pl-8 mb-4">
            <li className="mb-2">A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
            <li className="mb-2">Identification of the copyrighted work claimed to have been infringed</li>
            <li className="mb-2">Identification of the material that is claimed to be infringing and where it is located on the platform</li>
            <li className="mb-2">Your contact information, including address, telephone number, and email address</li>
            <li className="mb-2">A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or law</li>
            <li className="mb-2">A statement, made under penalty of perjury, that the above information is accurate and that you are the copyright owner or are authorized to act on behalf of the owner</li>
          </ol>
          
          <Heading level="h3" className="mt-6 mb-2">Copyright Agent</Heading>
          <Text className="mb-4">
            DMCA notifications should be sent to our Copyright Agent at:
          </Text>
          
          <div className="bg-muted p-4 rounded-md mb-4">
            <p>Copyright Agent</p>
            <p>EdPsych AI</p>
            <p>123 Education Lane</p>
            <p>Learning City, ED 12345</p>
            <p>Email: copyright@edpsychai.com</p>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="mr-4" asChild>
              <Link href="/dmca-form">
                <FileText className="mr-2 h-4 w-4" />
                Submit DMCA Notice
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="mailto:copyright@edpsychai.com">
                <Mail className="mr-2 h-4 w-4" />
                Email Copyright Agent
              </Link>
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Counter-Notice Procedures</Heading>
          <Text className="mb-4">
            If you believe that your content was removed or disabled as a result of a mistake or misidentification, you may submit a counter-notice to our Copyright Agent containing the following information:
          </Text>
          
          <ol className="list-decimal pl-8 mb-4">
            <li className="mb-2">Your physical or electronic signature</li>
            <li className="mb-2">Identification of the content that has been removed or disabled and the location where it appeared before removal</li>
            <li className="mb-2">A statement under penalty of perjury that you have a good faith belief that the content was removed or disabled as a result of mistake or misidentification</li>
            <li className="mb-2">Your name, address, telephone number, and email address</li>
            <li className="mb-2">A statement that you consent to the jurisdiction of the federal court in the district where you reside and that you will accept service of process from the person who provided the original DMCA notification</li>
          </ol>
          
          <Text className="mb-4">
            If a counter-notice is received, EdPsych AI may send a copy to the original complaining party informing them that the removed content may be restored in 10 business days unless the copyright owner files an action seeking a court order against the content provider.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Repeat Infringer Policy</Heading>
          <Text className="mb-4">
            EdPsych AI maintains a policy of terminating the accounts of users who are determined to be repeat infringers of copyright. A repeat infringer is a user who has been notified of infringing activity more than twice and/or has had User Content removed from the platform more than twice.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">International Copyright</Heading>
          <Text className="mb-4">
            EdPsych AI is based in the United States but serves users globally. We respect copyright laws in all jurisdictions where our services are available. Users are responsible for complying with copyright laws in their respective jurisdictions.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4">Changes to This Notice</Heading>
          <Text className="mb-4">
            EdPsych AI reserves the right to modify this Copyright Notice at any time. We will notify users of any material changes by posting the new Copyright Notice on this page and updating the "Last Updated" date.
          </Text>
          
          <Text className="mb-4">
            Your continued use of the EdPsych AI Platform after any changes to this Copyright Notice constitutes your acceptance of the revised terms.
          </Text>
          
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">Last Updated: June 7, 2025</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <Heading level="h2" className="mb-4">Contact Information</Heading>
          <Text className="mb-4">
            If you have any questions about this Copyright Notice, please contact us at:
          </Text>
          
          <div className="bg-muted p-4 rounded-md mb-4">
            <p>EdPsych AI</p>
            <p>123 Education Lane</p>
            <p>Learning City, ED 12345</p>
            <p>Email: legal@edpsychai.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </Card>
      </div>
    </AIEnhancedLayout>
  );
}

export default CopyrightPage;