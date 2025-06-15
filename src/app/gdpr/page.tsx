'use client';

import dynamic from 'next/dynamic';

import React from 'react';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileText, 
  User, 
  Lock, 
  Globe, 
  AlertTriangle,
  Clock,
  Mail
} from 'lucide-react';
import Link from 'next/link';
// Original component

const AIEnhancedLayout = dynamic(
  () => import('@/components/layouts/AIEnhancedLayout'),
  { ssr: false }
);

function GDPRPage() {
  return (
    <AIEnhancedLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <Heading level="h1">GDPR Compliance</Heading>
        </div>
        
        <Text className="text-xl mb-8">
          EdPsych AI is committed to protecting your personal data and complying with the General Data Protection Regulation (GDPR). This page outlines how we ensure compliance with GDPR requirements and protect your rights as a data subject.
        </Text>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" /> Overview of GDPR
          </Heading>
          <Text className="mb-4">
            The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect on May 25, 2018. It applies to all organizations operating within the EU and to organizations outside the EU that offer goods or services to individuals in the EU or monitor their behavior.
          </Text>
          <Text className="mb-4">
            The GDPR gives individuals greater control over their personal data and requires organizations to be transparent about how they collect, use, and store personal information. It also establishes strict guidelines for data security and breach notification.
          </Text>
          <Text>
            At EdPsych AI, we have implemented comprehensive measures to ensure full compliance with GDPR requirements whilst delivering our educational AI services.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <Lock className="h-5 w-5 mr-2" /> Legal Basis for Processing
          </Heading>
          <Text className="mb-4">
            Under GDPR, we must have a valid legal basis for processing personal data. Depending on the specific context, we rely on the following legal bases:
          </Text>
          
          <div className="space-y-4 mb-4">
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Consent</Heading>
              <Text>
                Where required, we obtain clear and explicit consent from users before collecting and processing their personal data. This applies particularly to marketing communications and certain types of data collection for educational analytics.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Contractual Necessity</Heading>
              <Text>
                We process personal data as necessary to fulfill our contractual obligations to users who have subscribed to our services or entered into agreements with us.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Legitimate Interests</Heading>
              <Text>
                In some cases, we process data based on our legitimate interests, such as improving our services, ensuring security, and preventing fraud. We always balance these interests against the individual's privacy rights.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Legal Obligation</Heading>
              <Text>
                We may process personal data to comply with legal obligations, such as tax laws or government regulations applicable to educational institutions.
              </Text>
            </div>
          </div>
          
          <Text>
            For each type of data processing activity, we clearly identify and document the legal basis in our internal records and privacy notices.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" /> Data Subject Rights
          </Heading>
          <Text className="mb-4">
            Under GDPR, individuals have enhanced rights regarding their personal data. EdPsych AI respects and facilitates these rights:
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Right to Access</Heading>
              <Text>
                You can request a copy of all personal data we hold about you, including information about how we use it.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Right to Rectification</Heading>
              <Text>
                You can request that we correct any inaccurate or incomplete personal data we hold about you.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Right to Erasure</Heading>
              <Text>
                Also known as the "right to be forgotten," you can request that we delete your personal data in certain circumstances.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Right to Restrict Processing</Heading>
              <Text>
                You can request that we limit how we use your data in certain circumstances, such as whilst we verify its accuracy.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Right to Data Portability</Heading>
              <Text>
                You can request a copy of your data in a machine-readable format to transfer to another service provider.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <Heading level="h3" className="text-lg mb-2">Right to Object</Heading>
              <Text>
                You can object to certain types of processing, including direct marketing and processing based on legitimate interests.
              </Text>
            </div>
          </div>
          
          <Text className="mb-4">
            To exercise any of these rights, please contact our Data Protection Officer using the contact information provided at the bottom of this page. We will respond to all requests within 30 days.
          </Text>
          
          <div className="flex justify-center">
            <Link href="/data-subject-request">
              <Button className="mr-4">
                Submit Data Subject Request
              </Button>
            </Link>
          </div>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <Lock className="h-5 w-5 mr-2" /> Data Protection Measures
          </Heading>
          <Text className="mb-4">
            EdPsych AI implements robust technical and organizational measures to protect personal data:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text><span className="font-semibold">Encryption:</span> All personal data is encrypted both in transit and at rest using industry-standard encryption protocols.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Access Controls:</span> Strict access controls limit data access to authorized personnel only, with multi-factor authentication required.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Regular Security Audits:</span> We conduct regular security assessments and penetration testing to identify and address vulnerabilities.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Data Minimization:</span> We collect only the data necessary for the specified purposes and retain it only as long as necessary.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Staff Training:</span> All staff members receive regular training on data protection and security practices.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Privacy by Design:</span> Data protection considerations are integrated into all new features and services from the design phase.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Anonymization and Pseudonymization:</span> Where appropriate, we anonymize or pseudonymize personal data to enhance privacy.</Text>
            </li>
          </ul>
          
          <Text>
            These measures are regularly reviewed and updated to ensure they remain effective against evolving security threats.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2" /> International Transfers
          </Heading>
          <Text className="mb-4">
            EdPsych AI primarily stores and processes data within the European Economic Area (EEA). However, in some cases, we may transfer data to trusted third-party service providers located outside the EEA.
          </Text>
          <Text className="mb-4">
            When transferring personal data outside the EEA, we ensure appropriate safeguards are in place through one or more of the following mechanisms:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>EU-approved standard contractual clauses</Text>
            </li>
            <li>
              <Text>Binding corporate rules for transfers within our corporate group</Text>
            </li>
            <li>
              <Text>Adequacy decisions for countries deemed to provide adequate protection</Text>
            </li>
            <li>
              <Text>Explicit consent from the data subject (in limited circumstances)</Text>
            </li>
          </ul>
          
          <Text>
            We maintain a detailed record of all international data transfers and the specific safeguards applied to each.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8 border-amber-500">
          <div className="flex items-start mb-4">
            <AlertTriangle className="text-amber-500 mr-2 h-6 w-6 flex-shrink-0" />
            <Heading level="h2">Data Breach Notification</Heading>
          </div>
          
          <Text className="mb-4">
            In the unlikely event of a personal data breach, EdPsych AI has a comprehensive response plan in place:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>We will notify the relevant supervisory authority within 72 hours of becoming aware of the breach, where feasible.</Text>
            </li>
            <li>
              <Text>If the breach is likely to result in a high risk to the rights and freedoms of individuals, we will also notify the affected individuals without undue delay.</Text>
            </li>
            <li>
              <Text>The notification will include the nature of the breach, the likely consequences, the measures taken to address the breach, and contact information for our Data Protection Officer.</Text>
            </li>
            <li>
              <Text>We maintain a record of all data breaches, including those that do not require notification.</Text>
            </li>
          </ul>
          
          <Text>
            Our incident response team conducts regular drills to ensure we can respond quickly and effectively to any potential data breach.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" /> Data Protection Impact Assessments
          </Heading>
          <Text className="mb-4">
            For processing activities that may result in a high risk to individuals' rights and freedoms, EdPsych AI conducts Data Protection Impact Assessments (DPIAs) before implementing new technologies or processes.
          </Text>
          <Text className="mb-4">
            Our DPIA process includes:
          </Text>
          
          <ol className="list-decimal pl-8 mb-4 space-y-2">
            <li>
              <Text>A systematic description of the processing operations and purposes</Text>
            </li>
            <li>
              <Text>An assessment of the necessity and proportionality of the processing</Text>
            </li>
            <li>
              <Text>An assessment of the risks to the rights and freedoms of data subjects</Text>
            </li>
            <li>
              <Text>The measures implemented to address the risks and demonstrate compliance</Text>
            </li>
          </ol>
          
          <Text>
            We consult with our Data Protection Officer and, where appropriate, with the relevant supervisory authority and affected individuals during the DPIA process.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" /> Data Protection Officer
          </Heading>
          <Text className="mb-4">
            EdPsych AI has appointed a Data Protection Officer (DPO) to oversee our data protection strategy and ensure compliance with GDPR requirements. Our DPO's responsibilities include:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Informing and advising EdPsych AI and its employees about their obligations under GDPR</Text>
            </li>
            <li>
              <Text>Monitoring compliance with GDPR and other data protection laws</Text>
            </li>
            <li>
              <Text>Providing advice on Data Protection Impact Assessments</Text>
            </li>
            <li>
              <Text>Cooperating with supervisory authorities</Text>
            </li>
            <li>
              <Text>Acting as a contact point for data subjects and supervisory authorities</Text>
            </li>
          </ul>
          
          <div className="bg-muted p-4 rounded-md mb-4">
            <Heading level="h3" className="text-lg mb-2">Contact Our DPO</Heading>
            <Text className="mb-2">
              If you have any questions about our GDPR compliance or wish to exercise your data subject rights, please contact our Data Protection Officer:
            </Text>
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2" />
              <Text>dpo@edpsychai.com</Text>
            </div>
            <div className="flex items-center mb-2">
              <Globe className="h-4 w-4 mr-2" />
              <Text>EdPsych AI, 123 Education Lane, Learning City, ED 12345</Text>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <Text>Response time: Within 2 business days</Text>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link href="/contact-dpo">
              <Button>
                Contact Data Protection Officer
              </Button>
            </Link>
          </div>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" /> Complaint Procedures
          </Heading>
          <Text className="mb-4">
            If you believe that our processing of your personal data infringes data protection laws, you have the right to lodge a complaint with a supervisory authority. We encourage you to contact us first, so we can address your concerns directly:
          </Text>
          
          <ol className="list-decimal pl-8 mb-4 space-y-2">
            <li>
              <Text>Contact our Data Protection Officer with the details of your complaint.</Text>
            </li>
            <li>
              <Text>We will investigate your complaint and provide a response within 30 days.</Text>
            </li>
            <li>
              <Text>If you are not satisfied with our response, you may escalate your complaint to the relevant supervisory authority.</Text>
            </li>
          </ol>
          
          <Text className="mb-4">
            You have the right to lodge a complaint directly with a supervisory authority without first contacting us. The lead supervisory authority for EdPsych AI is:
          </Text>
          
          <div className="bg-muted p-4 rounded-md">
            <Text className="font-medium">Information Commissioner's Office (ICO)</Text>
            <Text>Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF, United Kingdom</Text>
            <Text>Phone: 0303 123 1113</Text>
            <Text>Website: ico.org.uk</Text>
          </div>
        </Card>
        
        <Card className="p-6">
          <Heading level="h2" className="mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" /> Updates to This Statement
          </Heading>
          <Text className="mb-4">
            We may update this GDPR Compliance Statement from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes through our platform or by email.
          </Text>
          
          <Text className="mb-4">
            This statement should be read in conjunction with our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which provides more detailed information about our data processing activities.
          </Text>
          
          <div className="bg-muted p-4 rounded-md">
            <Text className="font-medium">Last Updated: June 7, 2025</Text>
          </div>
        </Card>
      </div>
    </AIEnhancedLayout>
  );
}

export default GDPRPage;