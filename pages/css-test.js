import React from 'react';
import Button, { ButtonLink } from '../src/components/Button';
import Typography, { GradientText, H1, H2, H3, Lead } from '../src/components/Typography';
import Navigation from '../src/components/Navigation';

/**
 * CSS Test Page
 * This page is used to test that CSS styles are being applied correctly
 */
export default function CSSTest() {
  // Navigation items for the test
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/css-test', label: 'CSS Test', active: true },
    { href: '/student', label: 'Student Dashboard' },
    { href: '/educator', label: 'Educator Dashboard' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <div>
      <Navigation 
        variant="sticky" 
        items={navItems} 
        title="EdPsych Connect" 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <H1>CSS Test Page</H1>
          <Lead>
            This page tests various CSS components to ensure styles are being applied correctly.
          </Lead>
          
          <section className="my-8">
            <H2>Text Gradient Test</H2>
            <p className="mb-4">
              The following text should have gradient styling:
            </p>
            <div className="space-y-4">
              <GradientText variant="h3">Default Gradient Text</GradientText>
              <GradientText variant="h3" gradient="gradientPurpleBlue">Purple-Blue Gradient</GradientText>
              <GradientText variant="h3" gradient="gradientPinkPurple">Pink-Purple Gradient</GradientText>
              <GradientText variant="h3" gradient="gradientOrangeRed">Orange-Red Gradient</GradientText>
              <GradientText variant="h3" gradient="gradientGreenTeal">Green-Teal Gradient</GradientText>
              
              <div className="text-gradient text-2xl font-bold">
                Legacy class-based gradient (should still work)
              </div>
            </div>
          </section>
          
          <section className="my-8">
            <H2>Button Test</H2>
            <p className="mb-4">
              The following buttons should have proper styling:
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <Button variant="primary" size="sm">Small Button</Button>
              <Button variant="primary" size="md">Medium Button</Button>
              <Button variant="primary" size="lg">Large Button</Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <Button variant="nursery">Nursery Button</Button>
              <Button variant="earlyPrimary">Early Primary Button</Button>
            </div>
            
            <div className="mb-4">
              <Button variant="primary" fullWidth>Full Width Button</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <ButtonLink variant="primary" href="#">Primary Link Button</ButtonLink>
              <ButtonLink variant="secondary" href="#">Secondary Link Button</ButtonLink>
            </div>
            
            <div className="mt-4">
              <div className="btn-primary inline-block mr-4">
                Legacy class-based button (should still work)
              </div>
              <div className="btn-secondary inline-block">
                Legacy secondary button
              </div>
            </div>
          </section>
          
          <section className="my-8">
            <H2>Typography Test</H2>
            <div className="space-y-4">
              <H1>Heading 1</H1>
              <H2>Heading 2</H2>
              <H3>Heading 3</H3>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="h6">Heading 6</Typography>
              
              <Typography variant="p" size="xs">Extra Small Text</Typography>
              <Typography variant="p" size="sm">Small Text</Typography>
              <Typography variant="p" size="base">Base Text</Typography>
              <Typography variant="p" size="lg">Large Text</Typography>
              <Typography variant="p" size="xl">Extra Large Text</Typography>
              <Typography variant="p" size="xxl">2XL Text</Typography>
              
              <Typography variant="p" weight="light">Light Weight</Typography>
              <Typography variant="p" weight="normal">Normal Weight</Typography>
              <Typography variant="p" weight="medium">Medium Weight</Typography>
              <Typography variant="p" weight="semibold">Semibold Weight</Typography>
              <Typography variant="p" weight="bold">Bold Weight</Typography>
              
              <Lead>This is a lead paragraph with larger text and muted color.</Lead>
              <Typography variant="p" caption>This is a caption with smaller text and muted color.</Typography>
            </div>
          </section>
          
          <section className="my-8">
            <H2>Animation Test</H2>
            <p className="mb-4">
              The following elements should have animations:
            </p>
            <div className="space-y-4">
              <div className="animate-fade-in p-4 bg-blue-100 rounded">
                Fade In Animation
              </div>
              <div className="animate-slide-up p-4 bg-purple-100 rounded">
                Slide Up Animation
              </div>
              <div className="animate-bounce-subtle p-4 bg-green-100 rounded">
                Bounce Animation
              </div>
              <div className="animate-pulse-subtle p-4 bg-yellow-100 rounded">
                Pulse Animation
              </div>
            </div>
          </section>
          
          <section className="my-8">
            <H2>Card Test</H2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <H3>Card Title</H3>
                <p>This is a card with proper styling using the card class.</p>
                <Button variant="primary">Card Button</Button>
              </div>
              
              <div className="nursery-ui p-6">
                <H3>Nursery UI</H3>
                <p>This card has nursery-specific styling.</p>
                <Button variant="nursery">Nursery Button</Button>
              </div>
              
              <div className="early-primary-ui p-6">
                <H3>Early Primary UI</H3>
                <p>This card has early primary styling.</p>
                <Button variant="earlyPrimary">Early Primary Button</Button>
              </div>
              
              <div className="late-primary-ui p-6">
                <H3>Late Primary UI</H3>
                <p>This card has late primary styling.</p>
                <Button variant="primary">Primary Button</Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}