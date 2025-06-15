'use client';

import React, { Component, useCallback } from 'react';
import { createSafeClickHandler, safeNavigateWithDelay } from '../../utils/navigationDelay';
import { useSafeNavigation, isPuppeteer } from '../../utils/routerIntegration';
import PuppeteerSafeLink from '../common/PuppeteerSafeLink';
import { cn } from '@/lib/utils';

// Error boundary for navigation
class NavigationErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[NavigationErrorBoundary] Caught error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
      <NavigationErrorBoundary>
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <a href="/" className="flex-shrink-0 flex items-center">
                  EdPsych Connect
                </a>
              </div>
            </div>
          </div>
        </nav>
            </NavigationErrorBoundary>
    );
    }

    return this.props.children;
  }
}


const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Team', href: '/about/team' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

export function NavigationMenu() {
  // State for active path - safe for SSR
  const [activePath, setActivePath] = React.useState<string>('');

  // Only access window.location on client side
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname);
    }
  }, []);

  // Handle link clicks to prevent navigation errors
  const handleLinkClick = useCallback((e: any) => {
    try {
      // Update active path on click
      if (typeof window !== 'undefined' && e.currentTarget.href) {
        const url = new URL(e.currentTarget.href);
        setActivePath(url.pathname);
      }
      return true;
    } catch (error) {
      console.error('[NavigationMenu] Navigation error:', error);
      e.preventDefault();
      
      // Fallback to manual navigation
      if (typeof window !== 'undefined') {
        window.location.href = e.currentTarget.href;
      }
      return false;
    }
  }, []);

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6" data-feature="navigation-menu">
      {navigationItems.map((item) => (
        <PuppeteerSafeLink
          key={item.name}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            activePath === item.href
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
         onClick={handleLinkClick}>
          {item.name}
        </PuppeteerSafeLink>
      ))}
    </nav>
  );
}
