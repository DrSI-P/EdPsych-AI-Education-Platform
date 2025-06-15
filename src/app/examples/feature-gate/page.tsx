'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import feature gate components with SSR disabled
const FeatureGate = dynamic(
  () => import('@/components/subscription').then(mod => ({ default: mod.FeatureGate })),
  { ssr: false }
);

const withFeatureGate = dynamic(
  () => import('@/components/subscription').then(mod => ({ default: mod.withFeatureGate })),
  { ssr: false }
);

const withAuthProtection = dynamic(
  () => import('@/contexts/AuthContext').then(mod => ({ default: mod.withAuthProtection })),
  { ssr: false }
);

// Example component that is gated by a feature
const PremiumComponent = () => (
  <Card className="bg-primary/5">
    <CardHeader>
      <CardTitle>Premium Feature</CardTitle>
      <CardDescription>This is a premium feature that requires a subscription.</CardDescription>
    </CardHeader>
    <CardContent>
      <p>
        This content is only visible to users who have access to the premium feature.
        It could be an advanced tool, exclusive content, or any other premium functionality.
      </p>
    </CardContent>
    <CardFooter>
      <Button>Use Premium Feature</Button>
    </CardFooter>
  </Card>
);

function FeatureGateExamplePage() {
  const [showContent, setShowContent] = useState(false);
  
  // Note: GatedPremiumComponent would need to be created after withFeatureGate is loaded
  // For now, we'll use the FeatureGate component directly
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Feature Gate Examples</h1>
      <p className="text-muted-foreground mb-8">
        Examples of how to use the FeatureGate component to restrict access to premium features.
      </p>
      
      <Tabs defaultValue="basic">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Usage</TabsTrigger>
          <TabsTrigger value="hoc">HOC Usage</TabsTrigger>
          <TabsTrigger value="dynamic">Dynamic Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
          <p className="mb-6">
            Wrap any component with the FeatureGate component to restrict access based on subscription.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Free Feature</CardTitle>
                <CardDescription>This feature is available to all users.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This content is visible to everyone.</p>
              </CardContent>
            </Card>
            
            <FeatureGate 
              featureId="premium_feature"
              upgradeTitle="Premium Feature"
              upgradeDescription="This feature requires a premium subscription."
              creditCost={5}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Premium Feature</CardTitle>
                  <CardDescription>This feature requires a subscription.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This content is only visible to premium subscribers.</p>
                </CardContent>
              </Card>
            </FeatureGate>
          </div>
          
          <div className="bg-muted p-4 rounded-md mt-6">
            <h3 className="text-lg font-medium mb-2">Code Example</h3>
            <pre className="bg-muted-foreground/10 p-4 rounded-md overflow-x-auto">
              <code>{`<FeatureGate 
  featureId="premium_feature"
  upgradeTitle="Premium Feature"
  upgradeDescription="This feature requires a premium subscription."
  creditCost={5}
>
  <YourPremiumComponent />
</FeatureGate>`}</code>
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="hoc" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Higher-Order Component Usage</h2>
          <p className="mb-6">
            Use the withFeatureGate HOC to create a gated version of any component.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Component</CardTitle>
                <CardDescription>The component without feature gating.</CardDescription>
              </CardHeader>
              <CardContent>
                <PremiumComponent />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gated Component</CardTitle>
                <CardDescription>The same component with feature gating.</CardDescription>
              </CardHeader>
              <CardContent>
                <FeatureGate 
                  featureId="premium_feature"
                  upgradeTitle="Premium Feature Access"
                  upgradeDescription="This feature is available to subscribers with the Expert plan or higher."
                  creditCost={5}
                >
                  <PremiumComponent />
                </FeatureGate>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-muted p-4 rounded-md mt-6">
            <h3 className="text-lg font-medium mb-2">Code Example</h3>
            <pre className="bg-muted-foreground/10 p-4 rounded-md overflow-x-auto">
              <code>{`// Define your component
const PremiumComponent = () => (
  <div>Premium content here</div>
);

// Create a gated version of the component
const GatedPremiumComponent = withFeatureGate(
  PremiumComponent, 
  'premium_feature',
  {
    upgradeTitle: 'Premium Feature Access',
    upgradeDescription: 'This feature requires a subscription.',
    creditCost: 5,
  }
);

// Use the gated component
function MyPage() {
  return <GatedPremiumComponent />;
}`}</code>
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="dynamic" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Dynamic Content</h2>
          <p className="mb-6">
            Use the FeatureGate component with dynamic content and callbacks.
          </p>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dynamic Content Example</CardTitle>
              <CardDescription>
                This example shows how to use the FeatureGate component with dynamic content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowContent(!showContent)}
                className="mb-6"
              >
                {showContent ? 'Hide' : 'Show'} Premium Content
              </Button>
              
              {showContent && (
                <FeatureGate 
                  featureId="premium_content"
                  upgradeTitle="Premium Content"
                  upgradeDescription="This content requires a premium subscription or credits."
                  creditCost={2}
                  onUseCredits={() => alert('Credits used! You now have access to this content.')}
                >
                  <div className="bg-primary/10 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Premium Content</h3>
                    <p>
                      This is premium content that is only visible to users who have access to the premium_content feature
                      or have used credits to access it.
                    </p>
                  </div>
                </FeatureGate>
              )}
            </CardContent>
          </Card>
          
          <div className="bg-muted p-4 rounded-md mt-6">
            <h3 className="text-lg font-medium mb-2">Code Example</h3>
            <pre className="bg-muted-foreground/10 p-4 rounded-md overflow-x-auto">
              <code>{`const [showContent, setShowContent] = useState(false);

// Toggle button
<Button onClick={() => setShowContent(!showContent)}>
  {showContent ? 'Hide' : 'Show'} Premium Content
</Button>

// Conditional rendering with FeatureGate
{showContent && (
  <FeatureGate 
    featureId="premium_content"
    creditCost={2}
    onUseCredits={() => {
      // Do something when credits are used
      alert('Credits used! Access granted.');
    }}
  >
    <YourPremiumContent />
  </FeatureGate>
)}`}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FeatureGateExamplePage;