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
  BookOpen,
  FileSearch,
  Key,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
// Original component

const AIEnhancedLayout = dynamic(
  () => import('@/components/layouts/AIEnhancedLayout'),
  { ssr: false }
);

function FERPAPage() {
  return (
    <AIEnhancedLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <Heading level="h1">FERPA Compliance Statement</Heading>
        </div>
        
        <Text className="text-xl mb-8">
          EdPsych AI is committed to protecting the privacy of student educational records in accordance with the Family Educational Rights and Privacy Act (FERPA). This statement outlines how we comply with FERPA requirements and protect educational records.
        </Text>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" /> FERPA Overview
          </Heading>
          
          <Text className="mb-4">
            The Family Educational Rights and Privacy Act (FERPA) is a US federal law that protects the privacy of student educational records. The law applies to all schools and educational institutions that receive funds under an applicable programme of the US Department of Education.
          </Text>
          
          <Text className="mb-4">
            Whilst EdPsych AI is a UK-based platform, we adhere to FERPA standards as a best practice for protecting student data and to support our educational institution clients in the United States who must comply with FERPA.
          </Text>
          
          <Text className="mb-4">
            FERPA gives parents certain rights with respect to their children's educational records. These rights transfer to the student when they reach the age of 18 or attend a school beyond the high school level. Students to whom the rights have transferred are "eligible students."
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" /> Educational Records Protection
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI treats all student data as educational records protected under FERPA. This includes:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Student profile information</Text>
            </li>
            <li>
              <Text>Assessment results and grades</Text>
            </li>
            <li>
              <Text>Learning activity data</Text>
            </li>
            <li>
              <Text>Progress reports and analytics</Text>
            </li>
            <li>
              <Text>Personalized learning paths</Text>
            </li>
            <li>
              <Text>Communication records related to educational matters</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            We implement the following measures to protect these records:
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Access Controls</Heading>
              </div>
              <Text>
                Strict access controls ensure that only authorised users can access student records, based on their role and relationship to the student.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Key className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Encryption</Heading>
              </div>
              <Text>
                All educational records are encrypted both in transit and at rest using industry-standard encryption protocols.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <User className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Authentication</Heading>
              </div>
              <Text>
                Multi-factor authentication and secure login procedures protect against unauthorised access to student records.
              </Text>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <FileSearch className="h-5 w-5 mr-2 text-primary" />
                <Heading level="h3" className="text-lg">Audit Trails</Heading>
              </div>
              <Text>
                Comprehensive audit logs track all access to and modifications of educational records for accountability.
              </Text>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" /> Parental Rights
          </Heading>
          
          <Text className="mb-4">
            In accordance with FERPA, EdPsych AI supports the following parental rights:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text><span className="font-semibold">Right to inspect and review:</span> Parents have the right to inspect and review their child's educational records maintained by the school or on platforms like EdPsych AI.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Right to request amendments:</span> Parents have the right to request that a school or platform correct records they believe to be inaccurate or misleading.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Right to consent to disclosures:</span> Generally, schools and platforms must have written permission from the parent to release any information from a student's educational record.</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            EdPsych AI provides tools for educational institutions to facilitate these rights, including:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Parent portal access to view their child's educational records</Text>
            </li>
            <li>
              <Text>Record correction request mechanisms</Text>
            </li>
            <li>
              <Text>Consent management tools for disclosure authorisations</Text>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" /> Student Rights
          </Heading>
          
          <Text className="mb-4">
            When students reach the age of 18 or attend a post-secondary institution, these rights transfer from the parents to the student. EdPsych AI supports eligible students' rights to:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Inspect and review their own educational records</Text>
            </li>
            <li>
              <Text>Request amendments to inaccurate or misleading records</Text>
            </li>
            <li>
              <Text>Provide consent before their personally identifiable information is disclosed</Text>
            </li>
            <li>
              <Text>File complaints about alleged failures to comply with FERPA requirements</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            Our platform includes age-appropriate access controls that automatically adjust permissions when a student becomes an eligible student.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" /> Directory Information
          </Heading>
          
          <Text className="mb-4">
            FERPA allows schools to disclose "directory information" without consent under certain conditions. Directory information includes data that would not generally be considered harmful or an invasion of privacy if disclosed, such as:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Student's name</Text>
            </li>
            <li>
              <Text>Address</Text>
            </li>
            <li>
              <Text>Telephone number</Text>
            </li>
            <li>
              <Text>Date and place of birth</Text>
            </li>
            <li>
              <Text>Honours and awards</Text>
            </li>
            <li>
              <Text>Dates of attendance</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            EdPsych AI:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Clearly identifies which data fields are considered directory information</Text>
            </li>
            <li>
              <Text>Provides tools for schools to manage directory information disclosure preferences</Text>
            </li>
            <li>
              <Text>Respects opt-out requests for directory information disclosure</Text>
            </li>
            <li>
              <Text>Never uses directory information for marketing purposes without explicit consent</Text>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" /> Disclosure Exceptions
          </Heading>
          
          <Text className="mb-4">
            FERPA permits disclosure of educational records without consent under certain exceptions. EdPsych AI adheres to these exceptions and only discloses records without consent when:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Disclosure is to school officials with legitimate educational interests</Text>
            </li>
            <li>
              <Text>Disclosure is to officials of another school where the student seeks to enrol</Text>
            </li>
            <li>
              <Text>Disclosure is in connection with financial aid for which the student has applied</Text>
            </li>
            <li>
              <Text>Disclosure is to organisations conducting studies for or on behalf of the school</Text>
            </li>
            <li>
              <Text>Disclosure is to comply with a judicial order or lawfully issued subpoena</Text>
            </li>
            <li>
              <Text>Disclosure is in connection with a health or safety emergency</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            In all cases of disclosure under these exceptions, EdPsych AI:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>Documents the basis for the exception</Text>
            </li>
            <li>
              <Text>Limits disclosure to only the necessary information</Text>
            </li>
            <li>
              <Text>Maintains records of all disclosures</Text>
            </li>
            <li>
              <Text>Implements appropriate safeguards for the disclosed information</Text>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <FileSearch className="h-5 w-5 mr-2" /> Record-Keeping Requirements
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI maintains records of:
          </Text>
          
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>
              <Text>All requests for access to educational records</Text>
            </li>
            <li>
              <Text>All disclosures of educational records, including the parties who received the records and the legitimate interests they had in requesting the records</Text>
            </li>
            <li>
              <Text>All parental or eligible student consent forms</Text>
            </li>
            <li>
              <Text>All requests for amendments to records and their outcomes</Text>
            </li>
          </ul>
          
          <Text className="mb-4">
            These records are maintained for as long as the educational records themselves are maintained, and are available for inspection by parents, eligible students, and school officials with legitimate educational interests.
          </Text>
        </Card>
        
        <Card className="p-6 mb-8">
          <Heading level="h2" className="mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" /> Compliance Procedures
          </Heading>
          
          <Text className="mb-4">
            EdPsych AI implements the following procedures to ensure FERPA compliance:
          </Text>
          
          <ol className="list-decimal pl-8 mb-4 space-y-2">
            <li>
              <Text><span className="font-semibold">Annual notification:</span> We provide tools for educational institutions to deliver annual notifications to parents and eligible students about their rights under FERPA.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Staff training:</span> All EdPsych AI staff members who have access to educational records receive regular training on FERPA requirements.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Access controls:</span> We implement role-based access controls to ensure that only authorised individuals can access educational records.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Consent management:</span> Our platform includes robust consent management tools for tracking and enforcing parental and eligible student consent preferences.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Audit trails:</span> We maintain comprehensive audit trails of all access to and modifications of educational records.</Text>
            </li>
            <li>
              <Text><span className="font-semibold">Data protection:</span> We implement industry-standard security measures to protect educational records from unauthorised access, disclosure, alteration, and destruction.</Text>
            </li>
          </ol>
        </Card>
        
        <Card className="p-6 mb-8 border-amber-500">
          <div className="flex items-start mb-4">
            <AlertTriangle className="text-amber-500 mr-2 h-6 w-6 flex-shrink-0" />
            <Heading level="h2">Complaint Procedures</Heading>
          </div>
          
          <Text className="mb-4">
            If you believe there has been a violation of FERPA regarding your or your child's educational records, you can:
          </Text>
          
          <ol className="list-decimal pl-8 mb-4 space-y-2">
            <li>
              <Text>Contact your educational institution's FERPA compliance officer</Text>
            </li>
            <li>
              <Text>Contact EdPsych AI's Data Protection Officer at dpo@edpsychai.com</Text>
            </li>
            <li>
              <Text>File a complaint with the US Department of Education's Family Policy Compliance Office</Text>
            </li>
          </ol>
          
          <Text className="mb-4">
            EdPsych AI takes all FERPA complaints seriously and will cooperate fully with any investigation by educational institutions or regulatory authorities.
          </Text>
          
          <div className="bg-muted p-4 rounded-md mb-4">
            <Text className="font-medium">US Department of Education Family Policy Compliance Office:</Text>
            <Text>400 Maryland Avenue, SW</Text>
            <Text>Washington, D.C. 20202-8520</Text>
            <Text>Phone: 1-800-USA-LEARN (1-800-872-5327)</Text>
          </div>
        </Card>
        
        <Card className="p-6">
          <Heading level="h2" className="mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2" /> Contact Information
          </Heading>
          
          <Text className="mb-4">
            If you have any questions about our FERPA compliance or wish to exercise your rights regarding educational records, please contact:
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
              <Link href="/data-subject-request">
                Submit Records Request
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

export default FERPAPage;