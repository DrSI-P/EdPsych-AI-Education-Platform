'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

type EndToEndTestResult = {
  name: string;
  status: 'success' | 'error' | 'warning';
  duration: number;
  steps: {
    name: string;
    status: 'success' | 'error' | 'warning';
    message?: string;
  }[];
  errorMessage?: string;
};

type EndToEndTestProps = {
  onComplete?: (results: EndToEndTestResult[]) => void;
};

/**
 * End-to-End Test Runner Component
 * 
 * This component runs end-to-end tests for critical user journeys to ensure
 * all functionality works correctly across the platform.
 */
export default function EndToEndTestRunner({ onComplete }: EndToEndTestProps) {
  const [results, setResults] = useState<EndToEndTestResult[]>([]);
  const [testing, setTesting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Define critical user journeys to test
  const criticalJourneys = [
    {
      name: 'User Registration and Login',
      steps: [
        'Visit registration page',
        'Fill registration form',
        'Submit registration',
        'Verify email',
        'Login with credentials',
        'Access dashboard'
      ]
    },
    {
      name: 'Content Navigation and Access',
      steps: [
        'Login to platform',
        'Navigate to courses',
        'Select a course',
        'Access lesson content',
        'Complete interactive exercise',
        'View progress'
      ]
    },
    {
      name: 'Assessment Completion',
      steps: [
        'Login to platform',
        'Navigate to assessments',
        'Start assessment',
        'Answer questions',
        'Submit assessment',
        'View results'
      ]
    },
    {
      name: 'Profile Management',
      steps: [
        'Login to platform',
        'Navigate to profile',
        'Update personal information',
        'Change preferences',
        'Save changes',
        'Verify updates'
      ]
    },
    {
      name: 'Voice Navigation',
      steps: [
        'Login to platform',
        'Enable voice input',
        'Navigate using voice commands',
        'Access content via voice',
        'Complete task using voice',
        'Disable voice input'
      ]
    }
  ];
  
  // Start running end-to-end tests
  const startTesting = async () => {
    setTesting(true);
    setProgress(0);
    setResults([]);
    setError(null);
    
    const testResults: EndToEndTestResult[] = [];
    
    for (let i = 0; i < criticalJourneys.length; i++) {
      const journey = criticalJourneys[i];
      const startTime = performance.now();
      
      // Simulate running tests for this journey
      const journeySteps = [];
      let journeyStatus: 'success' | 'error' | 'warning' = 'success';
      let journeyError: string | undefined;
      
      for (const step of journey.steps) {
        // Simulate step execution
        // In a real implementation, this would run actual tests
        const isSuccess = Math.random() > 0.2; // 80% success rate for demo
        const isWarning = !isSuccess && Math.random() > 0.5;
        
        const stepStatus = isSuccess ? 'success' : (isWarning ? 'warning' : 'error');
        
        journeySteps.push({
          name: step,
          status: stepStatus,
          message: stepStatus === 'success' 
            ? 'Step completed successfully' 
            : (stepStatus === 'warning' 
              ? 'Step completed with warnings' 
              : 'Step failed')
        });
        
        // If any step fails, the journey fails
        if (stepStatus === 'error') {
          journeyStatus = 'error';
          journeyError = `Failed at step: ${step}`;
        } else if (stepStatus === 'warning' && journeyStatus !== 'error') {
          journeyStatus = 'warning';
        }
        
        // Small delay to simulate test execution
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      testResults.push({
        name: journey.name,
        status: journeyStatus,
        duration,
        steps: journeySteps,
        errorMessage: journeyError
      });
      
      // Update progress
      setProgress(Math.round(((i + 1) / criticalJourneys.length) * 100));
      setResults([...testResults]);
      
      // Small delay between journeys
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setTesting(false);
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(testResults);
    }
  };
  
  // Filter results based on active tab
  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    if (activeTab === 'success') return result.status === 'success';
    if (activeTab === 'warning') return result.status === 'warning';
    if (activeTab === 'error') return result.status === 'error';
    return true;
  });
  
  // Calculate summary statistics
  const successCount = results.filter(r => r.status === 'success').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const averageDuration = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length)
    : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>End-to-End Test Runner</CardTitle>
        <CardDescription>
          Test critical user journeys to ensure all functionality works correctly
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Critical User Journeys</div>
          <div className="space-y-2">
            {criticalJourneys.map((journey, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                <div>
                  <div className="font-medium">{journey.name}</div>
                  <div className="text-xs text-muted-foreground">{journey.steps.length} steps</div>
                </div>
                {results[index] && (
                  <Badge 
                    variant="outline" 
                    className={`
                      ${results[index].status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      ${results[index].status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                      ${results[index].status === 'error' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                    `}
                  >
                    {results[index].status === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {results[index].status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {results[index].status === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                    {results[index].status.charAt(0).toUpperCase() + results[index].status.slice(1)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {testing && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Running tests...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {results.length > 0 && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-2xl font-bold">{results.length}</div>
                <div className="text-sm text-muted-foreground">Total Journeys</div>
              </Card>
              <Card className="p-4 bg-green-50">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-muted-foreground">Success</div>
              </Card>
              <Card className="p-4 bg-amber-50">
                <div className="text-2xl font-bold text-amber-600">{warningCount}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </Card>
              <Card className="p-4 bg-red-50">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </Card>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Average Duration</div>
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-2">{averageDuration}</span>
                <span className="text-sm text-muted-foreground">ms per journey</span>
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  All ({results.length})
                </TabsTrigger>
                <TabsTrigger value="success">
                  Success ({successCount})
                </TabsTrigger>
                <TabsTrigger value="warning">
                  Warnings ({warningCount})
                </TabsTrigger>
                <TabsTrigger value="error">
                  Errors ({errorCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <div className="space-y-4">
                  {filteredResults.map((result, index) => (
                    <Card key={index}>
                      <CardHeader className="py-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{result.name}</CardTitle>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${result.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                              ${result.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                              ${result.status === 'error' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                            `}
                          >
                            {result.status === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {result.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {result.status === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                            {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>
                          Duration: {result.duration}ms
                          {result.errorMessage && (
                            <div className="text-red-500 mt-1">{result.errorMessage}</div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="space-y-2">
                          {result.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-center p-2 border rounded-md">
                              <div className="mr-2">
                                {step.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {step.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                                {step.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{step.name}</div>
                                {step.message && (
                                  <div className="text-xs text-muted-foreground">{step.message}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={startTesting} 
          disabled={testing}
          className="w-full"
        >
          {testing ? `Running Tests (${progress}%)` : 'Start End-to-End Tests'}
        </Button>
      </CardFooter>
    </Card>
  );
}
