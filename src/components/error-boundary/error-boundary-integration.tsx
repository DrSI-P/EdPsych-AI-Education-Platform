'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ErrorBoundary from './error-boundary';
import AgeAdaptiveErrorBoundary from './age-adaptive-error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Error Boundary Integration Component
 * 
 * This component provides examples and guidelines for integrating
 * error boundaries throughout the platform.
 */
export function ErrorBoundaryIntegration() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('usage');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Error Boundary Integration</h1>
      <p className="text-grey-600 mb-6">
        Guidelines and examples for integrating error boundaries throughout the platform
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usage">Usage Guidelines</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>When to Use Error Boundaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Error boundaries should be used in the following scenarios:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Around complex interactive components</li>
                <li>When integrating third-party libraries</li>
                <li>Around data visualization components</li>
                <li>For components that rely on external APIs</li>
                <li>Around user-generated content rendering</li>
              </ul>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  Error boundaries only catch errors in the components below them in the tree.
                  They do not catch errors in event handlers or asynchronous code.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Follow these guidelines when implementing error boundaries:</p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the standard ErrorBoundary component for most cases</li>
                <li>Use AgeAdaptiveErrorBoundary for student-facing content</li>
                <li>Provide meaningful fallback UI that explains the error</li>
                <li>Include retry mechanisms where appropriate</li>
                <li>Log errors to monitoring services</li>
              </ul>
              
              <Alert variant="success">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Best Practice</AlertTitle>
                <AlertDescription>
                  Place error boundaries strategically to isolate failures to specific components
                  rather than crashing the entire application.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Standard Error Boundary Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md">
                <ErrorBoundary
                  fallback={
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
                      <p className="text-red-600">The component failed to render. Please try again later.</p>
                      <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                        Reload Page
                      </Button>
                    </div>
                  }
                >
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-lg font-medium text-green-800">Component Rendered Successfully</h3>
                    <p className="text-green-600">This is a working component wrapped in an error boundary.</p>
                    <Button variant="outline" className="mt-2" onClick={() => { throw new Error("Test error!"); }}>
                      Trigger Error
                    </Button>
                  </div>
                </ErrorBoundary>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium mb-2">Implementation Code</h3>
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
                  {`<ErrorBoundary
  fallback={
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
      <p className="text-red-600">The component failed to render.</p>
      <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </div>
  }
>
  {/* Your component code here */}
</ErrorBoundary>`}
                </pre>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Age-Adaptive Error Boundary Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md">
                <AgeAdaptiveErrorBoundary
                  ageGroup="primary"
                  fallback={
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <h3 className="text-lg font-medium text-blue-800">Oops! Something's not working</h3>
                      <p className="text-blue-600">Don't worry! This isn't your fault. Let's try again.</p>
                      <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    </div>
                  }
                >
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-lg font-medium text-green-800">Age-Adaptive Component</h3>
                    <p className="text-green-600">This component uses age-appropriate error messages.</p>
                    <Button variant="outline" className="mt-2" onClick={() => { throw new Error("Test error!"); }}>
                      Trigger Error
                    </Button>
                  </div>
                </AgeAdaptiveErrorBoundary>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium mb-2">Implementation Code</h3>
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
                  {`<AgeAdaptiveErrorBoundary
  ageGroup="primary" // Options: "early-years", "primary", "secondary", "adult"
  fallback={
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h3 className="text-lg font-medium text-blue-800">Oops! Something's not working</h3>
      <p className="text-blue-600">Don't worry! This isn't your fault. Let's try again.</p>
      <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  }
>
  {/* Your component code here */}
</AgeAdaptiveErrorBoundary>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testing Error Boundaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Error boundaries should be thoroughly tested to ensure they catch errors
                properly and display appropriate fallback UI.
              </p>
              
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Testing Challenge</AlertTitle>
                <AlertDescription>
                  React error boundaries can be challenging to test because they rely on
                  errors being thrown during rendering.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium mb-2">Jest Test Example</h3>
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
                  {`import { render } from '@testing-library/react';
import ErrorBoundary from './error-boundary';

// Component that throws an error when rendered
const ThrowError = () => {
  throw new Error('Test error');
  return null;
};

describe('ErrorBoundary', () => {
  // Suppress console errors during tests
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalConsoleError;
  });
  
  it('renders fallback UI when child throws', () => {
    const { getByText } = render(
      <ErrorBoundary fallback={<div>Error occurred!</div>}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(getByText('Error occurred!')).toBeInTheDocument();
  });
});\`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ErrorBoundaryIntegration;
