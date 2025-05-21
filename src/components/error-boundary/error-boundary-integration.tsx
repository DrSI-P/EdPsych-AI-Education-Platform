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
const ErrorBoundaryIntegration: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('usage');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Error Boundary Integration</h1>
      <p className="text-grey-600 mb-6">
        Guidelines and examples for integrating error boundaries throughout the platform
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usage">Usage Guidelines</TabsTrigger>
          <TabsTrigger value="examples">Integration Examples</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>How to Use Error Boundaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Basic Usage</h3>
                <div className="bg-grey-50 p-4 rounded-md border">
                  <pre className="text-sm overflow-auto">
{`// Standard Error Boundary
import ErrorBoundary from '@/components/error-boundary/error-boundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// Age-Adaptive Error Boundary
import AgeAdaptiveErrorBoundary from '@/components/error-boundary/age-adaptive-error-boundary';

<AgeAdaptiveErrorBoundary ageGroup="late-primary">
  <YourComponent />
</AgeAdaptiveErrorBoundary>

// Root Error Boundary (for app-wide error handling)
import RootErrorBoundary from '@/components/error-boundary/root-error-boundary';

<RootErrorBoundary>
  <YourApp />
</RootErrorBoundary>`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">When to Use Error Boundaries</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Page-level boundaries:</span> Wrap each page component to prevent full-page crashes
                  </li>
                  <li>
                    <span className="font-medium">Feature-level boundaries:</span> Isolate complex features so errors don't affect the rest of the page
                  </li>
                  <li>
                    <span className="font-medium">Data-dependent components:</span> Wrap components that rely on external data
                  </li>
                  <li>
                    <span className="font-medium">Third-party integrations:</span> Isolate third-party components that might be unstable
                  </li>
                  <li>
                    <span className="font-medium">User input processing:</span> Protect form submission and input handling
                  </li>
                </ul>
              </div>
              
              <Alert variant="info" className="bg-blue-50 border-blue-100">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  Error boundaries only catch errors in the React component tree. They do not catch errors in:
                  <ul className="list-disc pl-5 mt-2 text-sm">
                    <li>Event handlers (use try/catch directly)</li>
                    <li>Asynchronous code (use try/catch and setState)</li>
                    <li>Server-side rendering (use error.tsx files)</li>
                    <li>Errors thrown outside of React components</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="examples" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Page-Level Integration</h3>
                <div className="bg-grey-50 p-4 rounded-md border">
                  <pre className="text-sm overflow-auto">
{`// app/some-feature/page.tsx
'use client';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { SomeFeatureContent } from '@/components/some-feature/content';

export default function SomeFeaturePage() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8">
        <SomeFeatureContent />
      </div>
    </ErrorBoundary>
  );
}`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Age-Adaptive Integration</h3>
                <div className="bg-grey-50 p-4 rounded-md border">
                  <pre className="text-sm overflow-auto">
{`// components/learning-activity/activity-content.tsx
'use client';

import { useUser } from '@/lib/auth';
import AgeAdaptiveErrorBoundary from '@/components/error-boundary/age-adaptive-error-boundary';
import { ActivityContent } from './activity-content';

export default function LearningActivity({ activityId }) {
  const { user } = useUser();
  const ageGroup = user?.ageGroup || 'late-primary';
  
  return (
    <AgeAdaptiveErrorBoundary ageGroup={ageGroup}>
      <ActivityContent activityId={activityId} />
    </AgeAdaptiveErrorBoundary>
  );
}`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Data Fetching Integration</h3>
                <div className="bg-grey-50 p-4 rounded-md border">
                  <pre className="text-sm overflow-auto">
{`// components/dashboard/data-visualisation.tsx
'use client';

import { useState, useEffect } from 'react';
import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { fetchDashboardData } from '@/lib/api';

function DataVisualization() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchDashboardData();
        setData(result);
      } catch (error) {
        // This error will be caught by the error boundary
        throw new Error(\`Failed to load dashboard data: \${error.message}\`);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <DashboardChart data={data} />;
}

export default function DashboardWrapper() {
  return (
    <ErrorBoundary>
      <DataVisualization />
    </ErrorBoundary>
  );
}`}
                  </pre>
                </div>
              </div>
              
              <Alert variant="success" className="bg-green-50 border-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Testing Tip</AlertTitle>
                <AlertDescription>
                  Use the <Button variant="link" className="p-0 h-auto text-green-600" onClick={() => router.push('/error-boundary-test')}>Error Boundary Test Page</Button> to see how error boundaries behave with different age groups and error scenarios.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="best-practices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Granular Error Boundaries</h3>
                <p className="mb-2">
                  Use multiple error boundaries at different levels of your component tree rather than just one at the top level. This prevents a single error from taking down the entire UI.
                </p>
                <div className="bg-grey-50 p-4 rounded-md border">
                  <pre className="text-sm overflow-auto">
{`// Good: Granular error boundaries
<ErrorBoundary>
  <Header />
</ErrorBoundary>

<ErrorBoundary>
  <Sidebar />
</ErrorBoundary>

<ErrorBoundary>
  <MainContent />
</ErrorBoundary>

<ErrorBoundary>
  <Footer />
</ErrorBoundary>

// Avoid: Single error boundary for everything
<ErrorBoundary>
  <Header />
  <Sidebar />
  <MainContent />
  <Footer />
</ErrorBoundary>`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Age-Appropriate Error Messages</h3>
                <p className="mb-2">
                  Always use the AgeAdaptiveErrorBoundary when the component will be used by students. Match the error message complexity to the cognitive development of the user.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 p-3 rounded-md border border-green-100">
                    <h4 className="text-sm font-medium text-green-800 mb-1">✅ Good Example</h4>
                    <p className="text-xs text-green-700">
                      Using age-appropriate language and visuals for younger students: "Oops! Something went wrong. Let's try again!"
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-md border border-red-100">
                    <h4 className="text-sm font-medium text-red-800 mb-1">❌ Bad Example</h4>
                    <p className="text-xs text-red-700">
                      Using technical jargon for young children: "Error: Component failed to render due to invalid props. Check console for stack trace."
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Error Reporting</h3>
                <p className="mb-2">
                  Always use the onError prop to log errors for monitoring and debugging. In production, these should be sent to an error monitoring service.
                </p>
                <div className="bg-grey-50 p-4 rounded-md border">
                  <pre className="text-sm overflow-auto">
{`<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to console in development
    console.error(error);
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example with Sentry
      // Sentry.captureException(error, {
      //   extra: { componentStack: errorInfo.componentStack }
      // });
    }
  }}
>
  <YourComponent />
</ErrorBoundary>`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Recovery Options</h3>
                <p className="mb-2">
                  Always provide clear recovery options in your error UI. Users should be able to either retry the operation or navigate away from the error.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 p-3 rounded-md border border-green-100">
                    <h4 className="text-sm font-medium text-green-800 mb-1">✅ Good Example</h4>
                    <p className="text-xs text-green-700">
                      Providing both "Try Again" and "Go Home" buttons with clear labels and icons
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-md border border-red-100">
                    <h4 className="text-sm font-medium text-red-800 mb-1">❌ Bad Example</h4>
                    <p className="text-xs text-red-700">
                      Showing only an error message with no way to recover or navigate away
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert variant="warning" className="bg-amber-50 border-amber-100">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle>Important Reminder</AlertTitle>
                <AlertDescription>
                  Error boundaries are a last resort for unexpected errors. They do not replace proper error handling and validation in your application logic. Always validate inputs, handle expected errors gracefully, and use try/catch for async operations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-centre">
        <Button 
          onClick={() => router.push('/error-boundary-test')}
          className="px-6"
        >
          Go to Error Boundary Test Page
        </Button>
      </div>
    </div>
  );
};

export default ErrorBoundaryIntegration;
