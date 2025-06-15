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
  User, 
  Lock, 
  AlertTriangle,
  Clock,
  Mail,
  CheckCircle,
  FileSearch,
  Key,
  Users
} from 'lucide-react';
import Link from 'next/link';
// Original component

const AIEnhancedLayout = dynamic(
  () => import('@/components/layouts/AIEnhancedLayout'),
  { ssr: false }
);

function COPPAPage() {
  return (
    <AIEnhancedLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <Heading level="h1">COPPA Compliance Statement</Heading>
        </div>
        
        <Text className="text-xl mb-8">
          EdPsych AI is committed to protecting the privacy of children under the age of 13. This statement outlines how we comply with the Children's Online Privacy Protection Act (COPPA) and the measures we take to protect children's personal information.
        </Text>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" /> COPPA Overview
          </Heading>
          
          <Text className="mb-4">
            The Children's Online Privacy Protection Act (COPPA) is a US federal law that imposes specific requirements on operators of websites or online services directed to children under 13 years of age, and on operators of other websites or online services that have actual knowledge that they are collecting personal information online from a child under 13 years of age.
          </Text>
          
          <Text className="mb-4">
            Whilst EdPsych AI is a UK-based platform, we adhere to COPPA standards as a best practice for protecting children's data and to support our educational institution clients in the United States who must comply with COPPA.
          </Text>
          
          <Text className="mb-4">
            COPPA requires operators to:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Post a clear and comprehensive privacy policy</Text>
            </li>
            <li>
              <Text>Provide direct notice to parents and obtain verifiable parental consent before collecting personal information from children</Text>
            </li>
            <li>
              <Text>Give parents the option to review their child's personal information, request deletion, and opt out of future collection</Text>
            </li>
            <li>
              <Text>Maintain the confidentiality, security, and integrity of information collected from children</Text>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" /> Information Collection from Children
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI may collect the following types of information from children under 13:
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <User className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Personal Information</Heading>
              </div>
              <Text>
                Limited personal information necessary for the educational context, such as first name, year group, and school ID.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Educational Data</Heading>
              </div>
              <Text>
                Learning activities, assessment results, progress data, and other educational information.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Usage Information</Heading>
              </div>
              <Text>
                Information about how the child uses the platform, including features accessed and time spent on activities.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Device Information</Heading>
              </div>
              <Text>
                Limited technical information necessary for the platform to function properly, such as device type and browser.
              </Text>
            </div>
          </div>
          
          <Text className="mb-4">
            We do NOT collect the following information from children under 13:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Full name</Text>
            </li>
            <li>
              <Text>Home address</Text>
            </li>
            <li>
              <Text>Email address (unless provided by the school with parental consent)</Text>
            </li>
            <li>
              <Text>Telephone number</Text>
            </li>
            <li>
              <Text>Social Security number or other government identifiers</Text>
            </li>
            <li>
              <Text>Precise geolocation data</Text>
            </li>
            <li>
              <Text>Photos, videos, or audio files containing the child's image or voice (unless explicitly authorised by the school with parental consent for specific educational activities)</Text>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" /> Parental Consent Procedures
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI obtains verifiable parental consent before collecting personal information from children under 13 through the following methods:
          </Text>
          
          <div className="space-y-4 mb-4">
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">School-Based Consent</Heading>
              <Text className="mb-2">
                For school-based accounts, we rely on educational institutions to obtain parental consent in accordance with their policies and procedures. Schools are required to:
              </Text>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text>Provide parents with our privacy policy and COPPA statement</Text>
                </li>
                <li>
                  <Text>Obtain verifiable parental consent before providing student information</Text>
                </li>
                <li>
                  <Text>Maintain records of parental consent</Text>
                </li>
              </ul>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Direct Parental Consent</Heading>
              <Text className="mb-2">
                For individual accounts not managed by schools, we obtain direct parental consent through:
              </Text>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text>Requiring a parent or guardian to complete a consent form</Text>
                </li>
                <li>
                  <Text>Verifying the parent's identity through credit card verification, ID check, or other reliable methods</Text>
                </li>
                <li>
                  <Text>Sending a confirmatory email or message to the parent</Text>
                </li>
                <li>
                  <Text>Requiring the parent to create their own account linked to the child's account</Text>
                </li>
              </ul>
            </div>
          </div>
          
          <Text className="mb-4">
            We maintain records of all parental consent for as long as the child's account is active, plus a reasonable period thereafter.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" /> Parental Rights
          </Heading>
          
          <Text className="mb-4">
            Parents of children under 13 have the following rights regarding their child's personal information:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text><span className="font-semibold">Right to review:</span> Parents can review their child's personal information collected by EdPsych AI.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Right to delete:</span> Parents can request the deletion of their child's personal information.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Right to refuse further collection:</span> Parents can refuse to allow further collection or use of their child's information.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Right to revoke consent:</span> Parents can revoke their consent at any time.</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            To exercise these rights, parents can:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Access the parent portal to view and manage their child's information</Text>
            </li>
            <li>
              <Text>Contact their child's school administrator (for school-based accounts)</Text>
            </li>
            <li>
              <Text>Contact our Data Protection Officer directly at dpo@edpsychai.com</Text>
            </li>
          </ul>
          
          <div className="flex justify-center">
            <Button className="mr-4" asChild>
              <Link href="/parent-portal">
                Access Parent Portal
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact-dpo">
                Contact Data Protection Officer
              </Link>
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <Lock className="h-5 w-5 mr-2" /> Information Use and Disclosure Limitations
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI uses children's personal information solely for educational purposes and to provide the platform's services. We limit our use and disclosure of children's personal information as follows:
          </Text>
          
          <div className="space-y-4 mb-4">
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Permitted Uses</Heading>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text>Providing and improving the educational services</Text>
                </li>
                <li>
                  <Text>Creating and maintaining student accounts</Text>
                </li>
                <li>
                  <Text>Personalising learning experiences</Text>
                </li>
                <li>
                  <Text>Generating anonymised analytics for educational purposes</Text>
                </li>
                <li>
                  <Text>Ensuring platform security and functionality</Text>
                </li>
              </ul>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Prohibited Uses</Heading>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <Text>Marketing or advertising to children</Text>
                </li>
                <li>
                  <Text>Selling children's personal information</Text>
                </li>
                <li>
                  <Text>Using children's information for behavioural targeting of advertisements</Text>
                </li>
                <li>
                  <Text>Publicly disclosing children's personal information</Text>
                </li>
                <li>
                  <Text>Using children's information for any purpose unrelated to the educational context</Text>
                </li>
              </ul>
            </div>
          </div>
          
          <Text className="mb-4">
            We may disclose children's personal information only to:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>School administrators and teachers with a legitimate educational interest</Text>
            </li>
            <li>
              <Text>Service providers who need access to perform services on our behalf, subject to contractual confidentiality and security obligations</Text>
            </li>
            <li>
              <Text>Parents or legal guardians of the child</Text>
            </li>
            <li>
              <Text>Law enforcement or regulatory agencies when required by law</Text>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" /> Data Retention and Deletion
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI retains children's personal information only for as long as necessary to fulfil the purpose for which it was collected and to comply with applicable laws. Our data retention practices include:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Retaining educational records for the duration of the school year plus one additional year, unless a longer retention period is requested by the school or required by law</Text>
            </li>
            <li>
              <Text>Automatically deleting inactive student accounts after 18 months</Text>
            </li>
            <li>
              <Text>Deleting personal information promptly upon request from a parent or school</Text>
            </li>
            <li>
              <Text>Anonymising data for analytical purposes after the retention period</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            When we delete personal information, we use secure deletion methods to ensure the information cannot be recovered.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" /> Third-Party Services
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI may use third-party service providers to support our platform. When we use third-party services that may access children's personal information, we:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Conduct due diligence to ensure they can provide appropriate security and confidentiality</Text>
            </li>
            <li>
              <Text>Enter into contracts that require them to maintain the confidentiality, security, and integrity of the information</Text>
            </li>
            <li>
              <Text>Limit their use of the information to the purposes for which it was provided</Text>
            </li>
            <li>
              <Text>Require them to delete the information when it is no longer needed for the purpose for which it was provided</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            We maintain a list of all third-party service providers who may have access to children's personal information and ensure they comply with COPPA requirements.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8 border-amber-500">
          <div className="flex items-start mb-4">
            <AlertTriangle className="text-amber-500 mr-2 h-6 w-6 flex-shrink-0" />
            <Heading level="h2">Compliance Procedures</Heading>
          </div>
          
          <Text className="mb-4">
            EdPsych AI implements the following procedures to ensure COPPA compliance:
          </Text>
          
          <ol className="list-decimal pl-8 mb-4 space-y-2">
            <li>
              <Text><span className="font-semibold">Regular audits:</span> We conduct regular audits of our data collection practices to ensure compliance with COPPA.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Staff training:</span> All staff members who may have access to children's personal information receive training on COPPA requirements.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Parental consent verification:</span> We regularly review and update our parental consent verification methods to ensure they remain effective.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Privacy policy updates:</span> We review and update our privacy policy and COPPA statement at least annually.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Security measures:</span> We implement and regularly update technical and organisational security measures to protect children's personal information.</Text>
            </li>
          </ol>
          
          <Text className="mb-4">
            We take COPPA compliance seriously and are committed to protecting children's privacy whilst providing valuable educational services.
          </Text>
        </Card>
        
        <Card className="p-6">
          <Heading level="h2" className="mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2" /> Contact Information
          </Heading>
          
          <Text className="mb-4">
            If you have any questions about our COPPA compliance or wish to exercise your rights as a parent regarding your child's personal information, please contact:
          </Text>
          
          <div className="bg-muted p-4 rounded-md mb-4">
            <Text className="font-medium">EdPsych AI Data Protection Officer</Text>
            <div className="flex items-center mb-2 mt-2">
              <Mail className="h-4 w-4 mr-2" />
              <Text>dpo@edpsychai.com</Text>
            </div>
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 mr-2" />
              <Text>Response time: Within 2 business days</Text>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button className="mr-4" asChild>
              <Link href="/parent-portal">
                Access Parent Portal
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact-dpo">
                Contact Data Protection Officer
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </AIEnhancedLayout>
  );
}

export default COPPAPage;