/**
 * UK Curriculum Content Validator for EdPsych AI Education Platform
 * This component validates and enhances content to align with UK educational standards
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  convertToUKSpelling, 
  validateKeyStageAppropriateContent, 
  checkCurriculumAlignment,
  convertToUKEducationalTerminology,
  ukNationalCurriculumSubjects,
  keyStageAgeRanges
} from '@/lib/uk-standards';
import { KeyStage } from '@/types';

export default function UKCurriculumValidator() {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('maths');
  const [keyStage, setKeyStage] = useState<KeyStage>('ks2');
  const [validationResults, setValidationResults] = useState<{
    spelling?: { original: string; corrected: string };
    terminology?: { original: string; corrected: string };
    keyStageAppropriate?: { valid: boolean; issues: string[] };
    curriculumAlignment?: { alignmentScore: number; suggestions: string[] };
  }>({});
  const [correctedContent, setCorrectedContent] = useState('');
  
  // Validate content against UK standards
  const validateContent = () => {
    // UK spelling check
    const ukSpelling = convertToUKSpelling(content);
    
    // UK terminology check
    const ukTerminology = convertToUKEducationalTerminology(ukSpelling);
    
    // Key stage appropriateness check
    const keyStageCheck = validateKeyStageAppropriateContent(ukTerminology, keyStage);
    
    // Curriculum alignment check
    const alignmentCheck = checkCurriculumAlignment(ukTerminology, subject, keyStage);
    
    // Set validation results
    setValidationResults({
      spelling: { original: content, corrected: ukSpelling },
      terminology: { original: ukSpelling, corrected: ukTerminology },
      keyStageAppropriate: keyStageCheck,
      curriculumAlignment: alignmentCheck
    });
    
    // Set corrected content
    setCorrectedContent(ukTerminology);
  };
  
  // Apply corrections to content
  const applyCorrections = () => {
    setContent(correctedContent);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">UK Curriculum Content Validator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Validate and enhance educational content to align with UK standards
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Content Input</CardTitle>
              <CardDescription>
                Enter educational content to validate against UK standards
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-stage">Key Stage</Label>
                <Select value={keyStage} onValueChange={(value) => setKeyStage(value as KeyStage)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select key stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(keyStageAgeRanges).map(([ks, info]) => (
                      <SelectItem key={ks} value={ks}>
                        {info.description} (Ages {info.min}-{info.max})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {ukNationalCurriculumSubjects[keyStage].map((subj) => (
                      <SelectItem key={subj.id} value={subj.id}>
                        {subj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Educational Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter educational content to validate..."
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button onClick={validateContent} disabled={!content}>Validate Content</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>
                UK standards compliance analysis
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {Object.keys(validationResults).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Enter content and click "Validate Content" to see results</p>
                </div>
              ) : (
                <Tabs defaultValue="spelling">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="spelling">Spelling & Terminology</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum Alignment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="spelling" className="space-y-4 pt-4">
                    {validationResults.spelling && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">UK Spelling</h3>
                        {validationResults.spelling.original !== validationResults.spelling.corrected ? (
                          <Alert variant="info">
                            <AlertTitle>Spelling corrections suggested</AlertTitle>
                            <AlertDescription>
                              Some words have been converted to UK English spelling.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert variant="success">
                            <AlertTitle>UK spelling verified</AlertTitle>
                            <AlertDescription>
                              No spelling corrections needed.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    {validationResults.terminology && (
                      <div className="space-y-2 mt-4">
                        <h3 className="text-lg font-semibold">UK Educational Terminology</h3>
                        {validationResults.terminology.original !== validationResults.terminology.corrected ? (
                          <Alert variant="info">
                            <AlertTitle>Terminology adjustments suggested</AlertTitle>
                            <AlertDescription>
                              Some terms have been converted to UK educational terminology.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert variant="success">
                            <AlertTitle>UK terminology verified</AlertTitle>
                            <AlertDescription>
                              No terminology adjustments needed.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    {validationResults.keyStageAppropriate && (
                      <div className="space-y-2 mt-4">
                        <h3 className="text-lg font-semibold">Key Stage Appropriateness</h3>
                        {validationResults.keyStageAppropriate.valid ? (
                          <Alert variant="success">
                            <AlertTitle>Content is appropriate for {keyStageAgeRanges[keyStage].description}</AlertTitle>
                            <AlertDescription>
                              The content complexity is suitable for ages {keyStageAgeRanges[keyStage].min}-{keyStageAgeRanges[keyStage].max}.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert variant="warning">
                            <AlertTitle>Content may not be appropriate for {keyStageAgeRanges[keyStage].description}</AlertTitle>
                            <AlertDescription>
                              <ul className="list-disc pl-5 mt-2">
                                {validationResults.keyStageAppropriate.issues.map((issue, index) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    {correctedContent && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Corrected Content</h3>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md whitespace-pre-wrap">
                          {correctedContent}
                        </div>
                        <Button onClick={applyCorrections} className="mt-4">Apply Corrections</Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="curriculum" className="space-y-4 pt-4">
                    {validationResults.curriculumAlignment && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">Curriculum Alignment Score</h3>
                          <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                validationResults.curriculumAlignment.alignmentScore >= 70
                                  ? 'bg-green-500'
                                  : validationResults.curriculumAlignment.alignmentScore >= 40
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${validationResults.curriculumAlignment.alignmentScore}%` }}
                            />
                          </div>
                          <p className="mt-1 text-sm">
                            {validationResults.curriculumAlignment.alignmentScore.toFixed(0)}% alignment with {keyStageAgeRanges[keyStage].description} {ukNationalCurriculumSubjects[keyStage].find(s => s.id === subject)?.name} curriculum
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold">Curriculum Suggestions</h3>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {validationResults.curriculumAlignment.suggestions.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <Alert variant={validationResults.curriculumAlignment.alignmentScore >= 70 ? 'success' : 'warning'}>
                          <AlertTitle>
                            {validationResults.curriculumAlignment.alignmentScore >= 70
                              ? 'Good curriculum alignment'
                              : 'Consider improving curriculum alignment'}
                          </AlertTitle>
                          <AlertDescription>
                            {validationResults.curriculumAlignment.alignmentScore >= 70
                              ? 'The content aligns well with UK curriculum objectives.'
                              : 'Consider addressing the curriculum suggestions to improve alignment.'}
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
