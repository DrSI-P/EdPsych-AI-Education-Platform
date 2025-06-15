"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Footer } from '@/components/layout/Footer';
import { NavigationMenu } from '@/components/layout/NavigationMenu';
import { Providers } from '@/components/providers';
import { VoiceAccessibilityProvider } from '@/components/accessibility';
import { RootErrorBoundary } from '@/components/error/RootErrorBoundary';

// Dynamically import components that use router hooks with SSR disabled
const FloatingAvatar = dynamic(
  () => import('@/components/Avatar/FloatingAvatar'),
  { ssr: false }
);

const FloatingVoiceControls = dynamic(
  () => import('@/components/accessibility').then(mod => ({ default: mod.FloatingVoiceControls })),
  { ssr: false }
);

const AskDrScott = dynamic(
  () => import('@/components/ask-dr-scott/AskDrScott').then(mod => ({ default: mod.AskDrScott })),
  { ssr: false }
);

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  // Always render providers to ensure router context is available
  return (
    <VoiceAccessibilityProvider>
      <Providers>
        <RootErrorBoundary>
          <div className="min-h-screen flex flex-col bg-primary">
            <header className="bg-primary border-b border-default sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
              <div className="container mx-auto py-4">
                <NavigationMenu />
              </div>
            </header>
            <main className="flex-grow bg-primary">
              <div className="animate-in">
                {children}
              </div>
            </main>
            <Footer />
          </div>
          <FloatingVoiceControls />
        </RootErrorBoundary>
      </Providers>
    </VoiceAccessibilityProvider>
  );
}