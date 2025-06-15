'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { 
  Scale,
  Shield,
  FileText,
  Cookie,
  GraduationCap,
  Lock,
  Users,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Info,
  Search,
  Download,
  ExternalLink,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Book,
  Briefcase,
  Heart,
  Eye,
  UserCheck,
  Database,
  Key,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  FileSearch,
  HelpCircle,
  MessageCircle,
  Newspaper,
  ScrollText,
  Gavel,
  UserX,
  UserPlus,
  CreditCard,
  RefreshCw,
  Ban,
  AlertTriangle,
  CheckSquare,
  XSquare,
  Flag,
  Bookmark,
  Share2,
  Printer,
  Languages,
  Accessibility,
  Building,
  Baby,
  School,
  Laptop,
  Smartphone,
  Wifi,
  Cloud,
  Server,
  ShieldOff,
  Unlock,
  UserMinus,
  FileX,
  Trash2,
  Archive,
  ClipboardCheck,
  ClipboardX,
  PenTool,
  Stamp,
  Award,
  BadgeCheck,
  BarChart,
  PieChart,
  TrendingUp,
  Activity,
  Zap,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Headphones,
  Speaker,
  Radio,
  Tv,
  Cpu,
  HardDrive,
  Save,
  Upload,
  FolderOpen,
  FolderLock,
  FileLock,
  FileKey,
  GitBranch,
  GitCommit,
  History,
  RotateCcw,
  Settings,
  Wrench,
  Hammer,
  Package,
  Box,
  Layers,
  Grid,
  List,
  LayoutGrid,
  LayoutList,
  Table,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Calculator,
  Binary,
  Code,
  Code2,
  Terminal,
  Command
} from 'lucide-react';

interface LegalProps {
  className?: string;
}

export function Legal({ className = '' }: LegalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [acceptedPolicies, setAcceptedPolicies] = useState<string[]>([]);

  // Legal document categories
  const legalCategories = [
    {
      id: 'core-policies',
      title: 'Core Policies',
      icon: Shield,
      description: 'Essential legal documents and user agreements',
      documents: [
        {
          id: 'terms',
          title: 'Terms of Service',
          description: 'Our terms and conditions for using the EdPsych Connect platform',
          href: '/legal/terms-of-service',
          lastUpdated: '2025-05-01',
          version: '2.3',
          required: true,
          icon: FileText
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          description: 'How we collect, use, and protect your personal information',
          href: '/legal/privacy-policy',
          lastUpdated: '2025-05-01',
          version: '2.2',
          required: true,
          icon: Lock
        },
        {
          id: 'cookies',
          title: 'Cookie Policy',
          description: 'Information about cookies and similar technologies we use',
          href: '/legal/cookie-policy',
          lastUpdated: '2025-04-15',
          version: '1.8',
          required: true,
          icon: Cookie
        },
        {
          id: 'acceptable-use',
          title: 'Acceptable Use Policy',
          description: 'Guidelines for appropriate use of our platform and services',
          href: '/acceptable-use',
          lastUpdated: '2025-04-01',
          version: '1.5',
          required: true,
          icon: CheckSquare
        }
      ]
    },
    {
      id: 'educational-compliance',
      title: 'Educational Compliance',
      icon: GraduationCap,
      description: 'Education-specific regulations and compliance',
      documents: [
        {
          id: 'educational-compliance',
          title: 'Educational Compliance',
          description: 'UK educational standards and regulatory compliance',
          href: '/legal/educational-compliance',
          lastUpdated: '2025-05-15',
          version: '3.0',
          required: false,
          icon: School
        },
        {
          id: 'safeguarding',
          title: 'Safeguarding Policy',
          description: 'Child protection and safeguarding procedures',
          href: '/safeguarding',
          lastUpdated: '2025-05-20',
          version: '2.5',
          required: true,
          icon: ShieldCheck
        },
        {
          id: 'sen-compliance',
          title: 'SEN/SEND Compliance',
          description: 'Special Educational Needs and Disabilities regulations',
          href: '/legal/sen-compliance',
          lastUpdated: '2025-04-20',
          version: '1.9',
          required: false,
          icon: Heart
        },
        {
          id: 'curriculum-alignment',
          title: 'Curriculum Alignment',
          description: 'UK National Curriculum compliance and standards',
          href: '/legal/curriculum-compliance',
          lastUpdated: '2025-04-10',
          version: '2.1',
          required: false,
          icon: Book
        }
      ]
    },
    {
      id: 'data-protection',
      title: 'Data Protection',
      icon: Database,
      description: 'GDPR and data protection regulations',
      documents: [
        {
          id: 'gdpr',
          title: 'GDPR Compliance',
          description: 'General Data Protection Regulation compliance details',
          href: '/legal/gdpr',
          lastUpdated: '2025-05-01',
          version: '2.4',
          required: true,
          icon: ShieldAlert
        },
        {
          id: 'data-processing',
          title: 'Data Processing Agreement',
          description: 'Terms for processing personal data',
          href: '/legal/data-processing',
          lastUpdated: '2025-04-25',
          version: '1.7',
          required: false,
          icon: Database
        },
        {
          id: 'data-retention',
          title: 'Data Retention Policy',
          description: 'How long we keep your data and why',
          href: '/legal/data-retention',
          lastUpdated: '2025-04-15',
          version: '1.6',
          required: false,
          icon: Archive
        },
        {
          id: 'subject-rights',
          title: 'Data Subject Rights',
          description: 'Your rights regarding your personal data',
          href: '/legal/subject-rights',
          lastUpdated: '2025-04-10',
          version: '1.4',
          required: false,
          icon: UserCheck
        }
      ]
    },
    {
      id: 'accessibility',
      title: 'Accessibility & Inclusion',
      icon: Accessibility,
      description: 'Commitment to digital accessibility',
      documents: [
        {
          id: 'accessibility',
          title: 'Accessibility Statement',
          description: 'Our commitment to WCAG 2.1 AA compliance',
          href: '/legal/accessibility',
          lastUpdated: '2025-05-10',
          version: '2.0',
          required: false,
          icon: Accessibility
        },
        {
          id: 'equality',
          title: 'Equality & Diversity Policy',
          description: 'Promoting equality and preventing discrimination',
          href: '/legal/equality-diversity',
          lastUpdated: '2025-04-30',
          version: '1.8',
          required: false,
          icon: Users
        },
        {
          id: 'inclusion',
          title: 'Digital Inclusion Policy',
          description: 'Ensuring equitable access to digital education',
          href: '/legal/digital-inclusion',
          lastUpdated: '2025-04-20',
          version: '1.5',
          required: false,
          icon: Globe
        }
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: Award,
      description: 'Copyright, trademarks, and content ownership',
      documents: [
        {
          id: 'copyright',
          title: 'Copyright Policy',
          description: 'Copyright ownership and usage rights',
          href: '/legal/copyright',
          lastUpdated: '2025-04-15',
          version: '1.6',
          required: false,
          icon: Copyright
        },
        {
          id: 'dmca',
          title: 'DMCA Policy',
          description: 'Digital Millennium Copyright Act compliance',
          href: '/legal/dmca',
          lastUpdated: '2025-04-10',
          version: '1.4',
          required: false,
          icon: FileX
        },
        {
          id: 'user-content',
          title: 'User Content Agreement',
          description: 'Terms for content you create and share',
          href: '/legal/user-content',
          lastUpdated: '2025-04-05',
          version: '1.5',
          required: false,
          icon: PenTool
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Safety',
      icon: ShieldCheck,
      description: 'Platform security and user safety measures',
      documents: [
        {
          id: 'security',
          title: 'Security Policy',
          description: 'How we protect the platform and your data',
          href: '/legal/security',
          lastUpdated: '2025-05-05',
          version: '2.1',
          required: false,
          icon: Lock
        },
        {
          id: 'incident-response',
          title: 'Security Incident Response',
          description: 'How we handle security incidents',
          href: '/legal/incident-response',
          lastUpdated: '2025-04-25',
          version: '1.7',
          required: false,
          icon: AlertTriangle
        },
        {
          id: 'vulnerability',
          title: 'Vulnerability Disclosure',
          description: 'Responsible disclosure of security vulnerabilities',
          href: '/legal/vulnerability-disclosure',
          lastUpdated: '2025-04-20',
          version: '1.5',
          required: false,
          icon: Bug
        }
      ]
    }
  ];

  // Quick access links
  const quickLinks = [
    { title: 'Report a Concern', href: '/contact/report', icon: Flag },
    { title: 'Data Request', href: '/legal/data-request', icon: Database },
    { title: 'Contact DPO', href: '/contact/dpo', icon: Mail },
    { title: 'Legal FAQ', href: '/legal/faq', icon: HelpCircle }
  ];

  // Recent updates
  const recentUpdates = [
    {
      date: '2025-05-20',
      title: 'Safeguarding Policy Updated',
      description: 'Enhanced procedures for online safety and incident reporting',
      type: 'update'
    },
    {
      date: '2025-05-15',
      title: 'Educational Compliance v3.0',
      description: 'Updated to reflect latest DfE guidelines and Ofsted requirements',
      type: 'major'
    },
    {
      date: '2025-05-10',
      title: 'Accessibility Statement',
      description: 'Published comprehensive WCAG 2.1 AA compliance documentation',
      type: 'new'
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'How is my child\'s data protected?',
      answer: 'We implement industry-leading security measures including encryption, access controls, and regular security audits. All data is stored in secure UK-based servers compliant with GDPR and educational data protection standards.'
    },
    {
      question: 'What are my rights under GDPR?',
      answer: 'You have the right to access, correct, delete, and port your personal data. You can also object to processing and withdraw consent at any time. Visit our Data Subject Rights page for detailed information.'
    },
    {
      question: 'How do I report a safeguarding concern?',
      answer: 'Safeguarding concerns should be reported immediately through our dedicated reporting system. Click the "Report a Concern" button or contact our Designated Safeguarding Lead directly.'
    },
    {
      question: 'Can I opt out of certain data processing?',
      answer: 'Yes, you can manage your data preferences in your account settings. Some processing is necessary for service provision, but optional processing like analytics can be disabled.'
    },
    {
      question: 'How long do you keep student data?',
      answer: 'We retain educational records in line with statutory requirements - typically 7 years after a student leaves. Some data may be anonymized for research purposes with appropriate consent.'
    }
  ];

  // Filter documents based on search
  const filterDocuments = (docs: any[]) => {
    if (!searchQuery) return docs;
    return docs.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Check if policy is accepted
  const isPolicyAccepted = (policyId: string) => {
    return acceptedPolicies.includes(policyId);
  };

  // Handle policy acceptance
  const handleAcceptPolicy = (policyId: string) => {
    setAcceptedPolicies([...acceptedPolicies, policyId]);
  };

  return (
    <div className={`container mx-auto py-8 px-4 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <Scale className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Legal Centre</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Access all legal documents, policies, and compliance information
        </p>
      </motion.div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Important:</strong> By using EdPsych Connect, you agree to our Terms of Service and Privacy Policy. 
            Educational institutions should review our Educational Compliance documentation.
            <Link href="/legal/privacy-policy" className="ml-2 underline font-medium">
              View simplified summary
            </Link>
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Card key={link.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Button variant="ghost" className="w-full h-full flex flex-col items-center justify-center p-4" asChild>
                  <Link href={link.href as any}>
                    <link.icon className="h-8 w-8 mb-2 text-primary" />
                    <span className="text-sm font-medium text-center">{link.title}</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search legal documents..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download All
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-1" />
                  Print Summary
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {legalCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * categoryIndex, duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <category.icon className="h-5 w-5 mr-2 text-primary" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterDocuments(category.documents).map((doc) => (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <doc.icon className="h-5 w-5 mr-2 text-primary" />
                              <div>
                                <CardTitle className="text-base">{doc.title}</CardTitle>
                                {doc.required && (
                                  <Badge variant="destructive" className="text-xs mt-1">Required</Badge>
                                )}
                              </div>
                            </div>
                            {isPolicyAccepted(doc.id) && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Version {doc.version}</span>
                            <span>Updated {doc.lastUpdated}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-3">
                          <div className="flex gap-2 w-full">
                            <Button variant="outline" size="sm" className="flex-1" asChild>
                              <Link href={doc.href as any}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            {!isPolicyAccepted(doc.id) && doc.required && (
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleAcceptPolicy(doc.id)}
                              >
                                Accept
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                Your Compliance Status
              </CardTitle>
              <CardDescription>
                Track your acceptance of required policies and documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {legalCategories.flatMap(cat => cat.documents.filter(doc => doc.required)).map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center">
                      {isPolicyAccepted(doc.id) ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-500 mr-3" />
                      )}
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {isPolicyAccepted(doc.id) ? 'Accepted' : 'Pending acceptance'}
                        </p>
                      </div>
                    </div>
                    {!isPolicyAccepted(doc.id) && (
                      <Button size="sm" asChild>
                        <Link href={doc.href as any}>Review</Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Newspaper className="h-5 w-5 mr-2 text-primary" />
                Recent Legal Updates
              </CardTitle>
              <CardDescription>
                Stay informed about changes to our policies and legal documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className={`p-2 rounded-full ${
                      update.type === 'major' ? 'bg-red-100' :
                      update.type === 'new' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      {update.type === 'major' ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : update.type === 'new' ? (
                        <Zap className="h-4 w-4 text-green-600" />
                      ) : (
                        <RefreshCw className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{update.title}</h4>
                        <span className="text-sm text-muted-foreground">{update.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Updates
              </Button>
            </CardFooter>
          </Card>

          {/* Subscribe to Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Stay Informed
              </CardTitle>
              <CardDescription>
                Get notified about important legal and policy updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notification Preferences</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Major policy changes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Security and privacy updates</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Educational compliance updates</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Monthly legal digest</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe to Updates</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about our legal policies and data protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{item.question}</h4>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/legal/privacy-policy">
                  View All FAQs
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Legal Glossary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="h-5 w-5 mr-2 text-primary" />
                Legal Glossary
              </CardTitle>
              <CardDescription>
                Understand common legal terms used in our policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">GDPR</h4>
                    <p className="text-sm text-muted-foreground">
                      General Data Protection Regulation - EU data protection law
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">DPA 2018</h4>
                    <p className="text-sm text-muted-foreground">
                      UK Data Protection Act 2018 - UK's implementation of GDPR
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">ICO</h4>
                    <p className="text-sm text-muted-foreground">
                      Information Commissioner's Office - UK data protection authority
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">DPO</h4>
                    <p className="text-sm text-muted-foreground">
                      Data Protection Officer - Person responsible for data protection compliance
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">DPIA</h4>
                    <p className="text-sm text-muted-foreground">
                      Data Protection Impact Assessment - Risk assessment for data processing
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">DSL</h4>
                    <p className="text-sm text-muted-foreground">
                      Designated Safeguarding Lead - Person responsible for child protection
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legal Team Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-primary" />
                  Legal Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">General Legal Inquiries</p>
                      <p className="text-sm text-muted-foreground">legal@edpsychconnect.org</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Legal Hotline</p>
                      <p className="text-sm text-muted-foreground">+44 20 7946 0958</p>
                      <p className="text-xs text-muted-foreground">Mon-Fri, 9am-5pm GMT</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Registered Address</p>
                      <p className="text-sm text-muted-foreground">
                        EdPsych Connect Ltd<br />
                        123 Education House<br />
                        London, EC1A 1BB<br />
                        United Kingdom
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection Officer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                  Data Protection Officer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Data Protection Officer</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">DPO Email</p>
                      <p className="text-sm text-muted-foreground">dpo@edpsychconnect.org</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">DPO Direct Line</p>
                      <p className="text-sm text-muted-foreground">+44 20 7946 0959</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground">
                  For data protection concerns, subject access requests, or GDPR inquiries, 
                  please contact our DPO directly.
                </p>
              </CardContent>
            </Card>

            {/* Regulatory Bodies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  Regulatory Bodies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Information Commissioner's Office (ICO)</p>
                    <p className="text-sm text-muted-foreground">
                      Wycliffe House, Water Lane<br />
                      Wilmslow, Cheshire SK9 5AF<br />
                      Tel: 0303 123 1113<br />
                      <Link href="https://ico.org.uk" className="text-primary hover:underline" target="_blank">
                        www.ico.org.uk
                        <ExternalLink className="h-3 w-3 inline ml-1" />
                      </Link>
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium">Department for Education (DfE)</p>
                    <p className="text-sm text-muted-foreground">
                      Piccadilly Gate, Store Street<br />
                      Manchester M1 2WD<br />
                      Tel: 0370 000 2288
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                  Quick Legal Inquiry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="inquiry-type">Inquiry Type</Label>
                    <select
                      id="inquiry-type"
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option>General Legal Question</option>
                      <option>Data Protection / GDPR</option>
                      <option>Safeguarding Concern</option>
                      <option>Accessibility Issue</option>
                      <option>Copyright / IP Matter</option>
                      <option>Contract Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="message">Your Message</Label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                      placeholder="Please describe your inquiry..."
                    />
                  </div>
                  <Button className="w-full">Submit Inquiry</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Languages className="h-5 w-5 mr-2 text-primary" />
                  Language Support
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Legal documents available in multiple languages
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Request Translation
                </Button>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Accessibility className="h-5 w-5 mr-2 text-primary" />
                  Accessible Formats
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Request documents in alternative formats
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Request Format
                </Button>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-primary" />
                  Bulk Download
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Download all legal documents as a ZIP file
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Download All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Also export some commonly used legal sub-components
export const PrivacyBanner = () => (
  <Alert className="mb-4">
    <Lock className="h-4 w-4" />
    <AlertDescription>
      We value your privacy. Read our <Link href="/legal/privacy-policy" className="underline">Privacy Policy</Link> to 
      learn how we protect your data.
    </AlertDescription>
  </Alert>
);

export const CookieBanner = () => (
  <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center">
        <Cookie className="h-5 w-5 mr-2 text-primary" />
        <p className="text-sm">
          We use cookies to improve your experience. By continuing, you agree to our{' '}
          <Link href="/legal/cookie-policy" className="underline">Cookie Policy</Link>.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Manage Preferences</Button>
        <Button size="sm">Accept All</Button>
      </div>
    </div>
  </div>
);

export const ComplianceBadge = ({ type }: { type: string }) => {
  const badges = {
    gdpr: { icon: ShieldCheck, text: 'GDPR Compliant' },
    ico: { icon: Building, text: 'ICO Registered' },
    cyber: { icon: Lock, text: 'Cyber Essentials' },
    wcag: { icon: Accessibility, text: 'WCAG 2.1 AA' }
  };

  const badge = badges[type as keyof typeof badges];
  if (!badge) return null;

  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
      <badge.icon className="h-4 w-4 mr-1" />
      {badge.text}
    </div>
  );
};

export { Legal as default };

// Type fixes for missing icons
const Copyright = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
    <path strokeWidth="2" d="M15 9.354a4 4 0 1 0 0 5.292"/>
  </svg>
);

const Bug = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);