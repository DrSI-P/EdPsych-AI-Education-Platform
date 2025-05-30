'use client';

import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/styles/global-styles.css';
import StylesInjector from '@/components/StylesInjector';
// VoiceInputProvider is now managed by root-layout-wrapper.tsx

// PWA head component for metadata
function PWAHead() {
  return (
    <>
      <meta name="application-name" content="EdPsych Connect" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="EdPsych Connect" />
      <meta name="description" content="Educational psychology platform for personalized learning" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#6366f1" />

      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon-167x167.png" />

      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#6366f1" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </>
  );
}

// Install prompt component inline implementation
function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isAppInstalled) {
      return; // Don't show install prompt if already installed
    }

    // Store the install prompt event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if we should show the prompt (not shown in last 7 days)
    const lastPromptTime = localStorage.getItem('installPromptLastShown');
    if (lastPromptTime) {
      const daysSinceLastPrompt = (Date.now() - parseInt(lastPromptTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPrompt < 7) {
        setShowPrompt(false);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) return;
    
    // Show the install prompt
    installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPromptEvent.userChoice;
    
    // Reset the install prompt variable
    setInstallPromptEvent(null);
    setShowPrompt(false);
    
    // Record when we showed the prompt
    localStorage.setItem('installPromptLastShown', Date.now().toString());
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Record when we showed the prompt
    localStorage.setItem('installPromptLastShown', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Install EdPsych Connect</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Install our app for offline access to educational resources and tools.
          </p>
          <div className="mt-4 flex space-x-3">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Install
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted (client-side only)
    setIsMounted(true);
    
    // Check if the app is online
    setIsOnline(navigator.onLine);

    // Add event listeners for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <SessionProvider session={session}>
      {/* Only render VoiceInputProvider on client-side to prevent SSR context issues */}
      {isMounted ? (
        <>
          <StylesInjector />
          <PWAHead />
          {!isOnline && (
            <div className="bg-yellow-500 text-white p-2 text-center">
              You are currently offline. Some features may be limited.
            </div>
          )}
          <Navbar />
          <main className="min-h-screen">
            <Component {...pageProps} />
          </main>
          <Footer />
          <Toaster />
          <InstallPrompt />
        </>
      ) : (
        <>
          <StylesInjector />
          <PWAHead />
          <Navbar />
          <main className="min-h-screen">
            <Component {...pageProps} />
          </main>
          <Footer />
          <Toaster />
        </>
      )}
    </SessionProvider>
  );
}
