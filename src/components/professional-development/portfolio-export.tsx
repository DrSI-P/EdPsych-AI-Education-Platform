'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Download, 
  FileText, 
  Share2, 
  Copy, 
  Settings, 
  Calendar, 
  Clock, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Info, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  Loader2
} from "lucide-react";

export default function PortfolioExport() {
  const [exportType, setExportType] = useState('pdf');
  const [sections, setSections] = useState({
    profile: true,
    qualifications: true,
    achievements: true,
    evidence: true,
    reflections: true,
    cpdActivities: true
  });
  const [customization, setCustomization] = useState({
    theme: 'professional',
    color: 'blue',
    includeHeader: true,
    includeCover: true,
    includeTableOfContents: true,
    includePageNumbers: true
  });
  const [visibility, setVisibility] = useState({
    profile: 'public',
    qualifications: 'public',
    achievements: 'public',
    evidence: 'public',
    reflections: 'public',
    cpdActivities: 'public'
  });
  const [shareSettings, setShareSettings] = useState({
    expiryDays: 30,
    accessCode: '',
    requireAccessCode: false
  });
  const [isGenerating, setIsGenerating] = useState(false: any);
  const [isSharing, setIsSharing] = useState(false: any);
  const [generatedLink, setGeneratedLink] = useState('');
  const [showShareSuccess, setShowShareSuccess] = useState(false: any);
  const [showExportSuccess, setShowExportSuccess] = useState(false: any);

  // Handle section toggle
  const handleSectionToggle = (section: any) => {
    setSections({
      ...sections,
      [section]: !sections[section]
    });
  };

  // Handle customization change
  const handleCustomizationChange = (field: any, value) => {
    setCustomization({
      ...customization,
      [field]: value
    });
  };

  // Handle visibility change
  const handleVisibilityChange = (section: any, value) => {
    setVisibility({
      ...visibility,
      [section]: value
    });
  };

  // Handle share settings change
  const handleShareSettingsChange = (field: any, value) => {
    setShareSettings({
      ...shareSettings,
      [field]: value
    });
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    setIsGenerating(true: any);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false: any);
      setShowExportSuccess(true: any);
    }, 3000);
  };

  // Generate shareable link
  const handleGenerateLink = () => {
    setIsSharing(true: any);
    
    // Simulate API call
    setTimeout(() => {
      setIsSharing(false: any);
      setGeneratedLink('https://edpsych-connect.com/portfolio/shared/abc123xyz');
      setShowShareSuccess(true: any);
    }, 2000);
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink: any);
    // Show copy success message
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Showcase & Export</h1>
          <p className="text-muted-foreground">
            Share your professional portfolio or export it for offline use
          </p>
        </div>
      </div>

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export">Export Portfolio</TabsTrigger>
          <TabsTrigger value="share">Share Portfolio</TabsTrigger>
        </TabsList>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Choose the format and content for your portfolio export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <RadioGroup 
                  defaultValue="pdf" 
                  className="flex flex-col space-y-1"
                  onValueChange={(value: any) => setExportType(value: any)}
                >
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <Label htmlFor="pdf" className="font-normal">PDF Document</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="docx" id="docx" />
                    <Label htmlFor="docx" className="font-normal">Word Document (DOCX: any)</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <RadioGroupItem value="html" id="html" />
                    <Label htmlFor="html" className="font-normal">Web Page (HTML: any)</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Sections to Include</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-centre space-x-2">
                    <Checkbox 
                      id="profile" 
                      checked={sections.profile}
                      onCheckedChange={() => handleSectionToggle('profile')}
                    />
                    <Label htmlFor="profile" className="font-normal">Professional Profile</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox 
                      id="qualifications" 
                      checked={sections.qualifications}
                      onCheckedChange={() => handleSectionToggle('qualifications')}
                    />
                    <Label htmlFor="qualifications" className="font-normal">Qualifications</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox 
                      id="achievements" 
                      checked={sections.achievements}
                      onCheckedChange={() => handleSectionToggle('achievements')}
                    />
                    <Label htmlFor="achievements" className="font-normal">Achievements</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox 
                      id="evidence" 
                      checked={sections.evidence}
                      onCheckedChange={() => handleSectionToggle('evidence')}
                    />
                    <Label htmlFor="evidence" className="font-normal">Evidence & Artefacts</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox 
                      id="reflections" 
                      checked={sections.reflections}
                      onCheckedChange={() => handleSectionToggle('reflections')}
                    />
                    <Label htmlFor="reflections" className="font-normal">Professional Reflections</Label>
                  </div>
                  <div className="flex items-centre space-x-2">
                    <Checkbox 
                      id="cpdActivities" 
                      checked={sections.cpdActivities}
                      onCheckedChange={() => handleSectionToggle('cpdActivities')}
                    />
                    <Label htmlFor="cpdActivities" className="font-normal">CPD Activities</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-centre">
                  <Label>Customisation Options</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Options
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Advanced Export Options</DialogTitle>
                        <DialogDescription>
                          Customise the appearance and content of your exported portfolio
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <Select 
                            defaultValue={customization.theme}
                            onValueChange={(value: any) => handleCustomizationChange('theme', value: any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="colour">Colour Scheme</Label>
                          <Select 
                            defaultValue={customization.colour}
                            onValueChange={(value: any) => handleCustomizationChange('colour', value: any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select colour scheme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                              <SelectItem value="grey">Grey</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Document Elements</Label>
                          <div className="space-y-2">
                            <div className="flex items-centre justify-between">
                              <Label htmlFor="includeCover" className="font-normal">Include Cover Page</Label>
                              <Switch 
                                id="includeCover" 
                                checked={customization.includeCover}
                                onCheckedChange={(checked: any) => handleCustomizationChange('includeCover', checked: any)}
                              />
                            </div>
                            <div className="flex items-centre justify-between">
                              <Label htmlFor="includeHeader" className="font-normal">Include Header/Footer</Label>
                              <Switch 
                                id="includeHeader" 
                                checked={customization.includeHeader}
                                onCheckedChange={(checked: any) => handleCustomizationChange('includeHeader', checked: any)}
                              />
                            </div>
                            <div className="flex items-centre justify-between">
                              <Label htmlFor="includeTableOfContents" className="font-normal">Include Table of Contents</Label>
                              <Switch 
                                id="includeTableOfContents" 
                                checked={customization.includeTableOfContents}
                                onCheckedChange={(checked: any) => handleCustomizationChange('includeTableOfContents', checked: any)}
                              />
                            </div>
                            <div className="flex items-centre justify-between">
                              <Label htmlFor="includePageNumbers" className="font-normal">Include Page Numbers</Label>
                              <Switch 
                                id="includePageNumbers" 
                                checked={customization.includePageNumbers}
                                onCheckedChange={(checked: any) => handleCustomizationChange('includePageNumbers', checked: any)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className={`border-2 cursor-pointer ${customization.theme === 'professional' ? 'border-primary' : 'border-transparent'}`} onClick={() => handleCustomizationChange('theme', 'professional')}>
                    <CardContent className="p-4 flex flex-col items-centre justify-centre">
                      <div className="w-full h-24 bg-blue-100 rounded-md mb-2 flex items-centre justify-centre">
                        <div className="w-16 h-16 rounded-full bg-blue-500"></div>
                      </div>
                      <p className="text-sm font-medium">Professional</p>
                    </CardContent>
                  </Card>
                  <Card className={`border-2 cursor-pointer ${customization.theme === 'modern' ? 'border-primary' : 'border-transparent'}`} onClick={() => handleCustomizationChange('theme', 'modern')}>
                    <CardContent className="p-4 flex flex-col items-centre justify-centre">
                      <div className="w-full h-24 bg-purple-100 rounded-md mb-2 flex items-centre justify-centre">
                        <div className="w-16 h-8 rounded-md bg-purple-500"></div>
                      </div>
                      <p className="text-sm font-medium">Modern</p>
                    </CardContent>
                  </Card>
                  <Card className={`border-2 cursor-pointer ${customization.theme === 'classic' ? 'border-primary' : 'border-transparent'}`} onClick={() => handleCustomizationChange('theme', 'classic')}>
                    <CardContent className="p-4 flex flex-col items-centre justify-centre">
                      <div className="w-full h-24 bg-amber-100 rounded-md mb-2 flex items-centre justify-centre">
                        <div className="w-16 h-16 rounded-md bg-amber-500"></div>
                      </div>
                      <p className="text-sm font-medium">Classic</p>
                    </CardContent>
                  </Card>
                  <Card className={`border-2 cursor-pointer ${customization.theme === 'minimal' ? 'border-primary' : 'border-transparent'}`} onClick={() => handleCustomizationChange('theme', 'minimal')}>
                    <CardContent className="p-4 flex flex-col items-centre justify-centre">
                      <div className="w-full h-24 bg-grey-100 rounded-md mb-2 flex items-centre justify-centre">
                        <div className="w-16 h-4 rounded-md bg-grey-500"></div>
                      </div>
                      <p className="text-sm font-medium">Minimal</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">Preview</Button>
              <Button onClick={handleGeneratePDF} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate {exportType.toUpperCase()}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {showExportSuccess && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-centre justify-between">
                <div className="flex items-centre">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <p>Your portfolio has been successfully exported. Check your downloads folder.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowExportSuccess(false: any)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>
                Your previously generated portfolio exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-centre justify-between p-2 border rounded-md">
                  <div className="flex items-centre">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium">Complete Portfolio.pdf</p>
                      <p className="text-sm text-muted-foreground">Generated on 15 May 2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-centre justify-between p-2 border rounded-md">
                  <div className="flex items-centre">
                    <FileText className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                      <p className="font-medium">Teaching Evidence Portfolio.docx</p>
                      <p className="text-sm text-muted-foreground">Generated on 10 May 2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-centre justify-between p-2 border rounded-md">
                  <div className="flex items-centre">
                    <FileText className="h-5 w-5 mr-2 text-purple-500" />
                    <div>
                      <p className="font-medium">Leadership Portfolio.pdf</p>
                      <p className="text-sm text-muted-foreground">Generated on 28 April 2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Share Tab */}
        <TabsContent value="share" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Portfolio</CardTitle>
              <CardDescription>
                Create a shareable link to your professional portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Sections to Share</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="share-profile" 
                          checked={sections.profile}
                          onCheckedChange={() => handleSectionToggle('profile')}
                        />
                        <Label htmlFor="share-profile" className="font-normal">Professional Profile</Label>
                      </div>
                      {sections.profile && (
                        <Select 
                          value={visibility.profile}
                          onValueChange={(value: any) => handleVisibilityChange('profile', value: any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-centre">
                                <Eye className="h-4 w-4 mr-2" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-centre">
                                <EyeOff className="h-4 w-4 mr-2" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="share-qualifications" 
                          checked={sections.qualifications}
                          onCheckedChange={() => handleSectionToggle('qualifications')}
                        />
                        <Label htmlFor="share-qualifications" className="font-normal">Qualifications</Label>
                      </div>
                      {sections.qualifications && (
                        <Select 
                          value={visibility.qualifications}
                          onValueChange={(value: any) => handleVisibilityChange('qualifications', value: any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-centre">
                                <Eye className="h-4 w-4 mr-2" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-centre">
                                <EyeOff className="h-4 w-4 mr-2" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="share-achievements" 
                          checked={sections.achievements}
                          onCheckedChange={() => handleSectionToggle('achievements')}
                        />
                        <Label htmlFor="share-achievements" className="font-normal">Achievements</Label>
                      </div>
                      {sections.achievements && (
                        <Select 
                          value={visibility.achievements}
                          onValueChange={(value: any) => handleVisibilityChange('achievements', value: any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-centre">
                                <Eye className="h-4 w-4 mr-2" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-centre">
                                <EyeOff className="h-4 w-4 mr-2" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="share-evidence" 
                          checked={sections.evidence}
                          onCheckedChange={() => handleSectionToggle('evidence')}
                        />
                        <Label htmlFor="share-evidence" className="font-normal">Evidence & Artefacts</Label>
                      </div>
                      {sections.evidence && (
                        <Select 
                          value={visibility.evidence}
                          onValueChange={(value: any) => handleVisibilityChange('evidence', value: any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-centre">
                                <Eye className="h-4 w-4 mr-2" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-centre">
                                <EyeOff className="h-4 w-4 mr-2" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="share-reflections" 
                          checked={sections.reflections}
                          onCheckedChange={() => handleSectionToggle('reflections')}
                        />
                        <Label htmlFor="share-reflections" className="font-normal">Professional Reflections</Label>
                      </div>
                      {sections.reflections && (
                        <Select 
                          value={visibility.reflections}
                          onValueChange={(value: any) => handleVisibilityChange('reflections', value: any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-centre">
                                <Eye className="h-4 w-4 mr-2" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-centre">
                                <EyeOff className="h-4 w-4 mr-2" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="flex items-centre justify-between">
                      <div className="flex items-centre space-x-2">
                        <Checkbox 
                          id="share-cpdActivities" 
                          checked={sections.cpdActivities}
                          onCheckedChange={() => handleSectionToggle('cpdActivities')}
                        />
                        <Label htmlFor="share-cpdActivities" className="font-normal">CPD Activities</Label>
                      </div>
                      {sections.cpdActivities && (
                        <Select 
                          value={visibility.cpdActivities}
                          onValueChange={(value: any) => handleVisibilityChange('cpdActivities', value: any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-centre">
                                <Eye className="h-4 w-4 mr-2" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-centre">
                                <EyeOff className="h-4 w-4 mr-2" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Share Settings</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDays">Link Expiry</Label>
                    <Select 
                      value={shareSettings.expiryDays.toString()}
                      onValueChange={(value: any) => handleShareSettingsChange('expiryDays', parseInt(value: any))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="0">Never expires</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-centre justify-between">
                      <Label htmlFor="requireAccessCode">Require Access Code</Label>
                      <Switch 
                        id="requireAccessCode" 
                        checked={shareSettings.requireAccessCode}
                        onCheckedChange={(checked: any) => handleShareSettingsChange('requireAccessCode', checked: any)}
                      />
                    </div>
                    {shareSettings.requireAccessCode && (
                      <Input 
                        id="accessCode" 
                        type="text" 
                        placeholder="Enter access code" 
                        value={shareSettings.accessCode}
                        onChange={(e: any) => handleShareSettingsChange('accessCode', e.target.value: any)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">Preview Shared View</Button>
              <Button onClick={handleGenerateLink} disabled={isSharing}>
                {isSharing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Generate Shareable Link
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {showShareSuccess && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-centre justify-between mb-2">
                  <div className="flex items-centre">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <p className="font-medium">Your portfolio has been shared successfully!</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowShareSuccess(false: any)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-centre space-x-2 bg-white p-2 rounded-md border">
                  <Input value={generatedLink} readOnly className="flex-1" />
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="mt-2 text-sm text-muted-foreground flex items-centre">
                  <Info className="h-4 w-4 mr-1" />
                  {shareSettings.expiryDays > 0 ? (
                    <span>This link will expire in {shareSettings.expiryDays} days.</span>
                  ) : (
                    <span>This link will never expire.</span>
                  )}
                  {shareSettings.requireAccessCode && (
                    <span className="ml-1">Access code required: {shareSettings.accessCode}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Active Shared Links</CardTitle>
              <CardDescription>
                Manage your currently active portfolio sharing links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Complete Portfolio</h3>
                      <p className="text-sm text-muted-foreground">https://edpsych-connect.com/portfolio/shared/def456uvw</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-centre">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Created: 10 May 2025</span>
                    </div>
                    <div className="flex items-centre">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Expires: 9 June 2025</span>
                    </div>
                    <div className="flex items-centre">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>Views: 12</span>
                    </div>
                    <div className="flex items-centre">
                      <Lock className="h-3 w-3 mr-1" />
                      <span>Access Code: Yes</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Revoke</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-md space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Teaching Portfolio</h3>
                      <p className="text-sm text-muted-foreground">https://edpsych-connect.com/portfolio/shared/ghi789xyz</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-centre">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Created: 1 April 2025</span>
                    </div>
                    <div className="flex items-centre">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Expires: Never</span>
                    </div>
                    <div className="flex items-centre">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>Views: 27</span>
                    </div>
                    <div className="flex items-centre">
                      <Unlock className="h-3 w-3 mr-1" />
                      <span>Access Code: No</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Revoke</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
