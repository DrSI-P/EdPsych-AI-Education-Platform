'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePredictiveCaching } from '@/lib/predictive-caching';
import ComprehensiveNavigation from '@/components/ui/ComprehensiveNavigation';
import { Footer } from '@/components/ui/footer';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

// Define media query hooks to replace react-responsive
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

interface AIEnhancedLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
  contentClassName?: string;
  fullWidth?: boolean;
  preloadResources?: boolean;
  adaptiveLayout?: boolean;
  accessibilityFeatures?: boolean;
  loadingIndicator?: React.ReactNode;
}

/**
 * AI-Enhanced Layout Component
 * 
 * A comprehensive layout component that integrates with AI systems to:
 * - Preload resources based on predicted user navigation
 * - Adapt the layout based on user preferences and behavior
 * - Optimize for different devices and screen sizes
 * - Include accessibility features
 * - Support different themes and color schemes
 */
const AIEnhancedLayout: React.FC<AIEnhancedLayoutProps> = ({
  children,
  showNavigation = true,
  showFooter = true,
  contentClassName = '',
  fullWidth = false,
  preloadResources = true,
  adaptiveLayout = true,
  accessibilityFeatures = true,
  loadingIndicator,
}) => {
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isPrint = useMediaQuery('print');
  
  // User session
  const { data: session } = useSession();
  const userId = session?.user?.id || 'anonymous';
  
  // Current path
  const pathname = usePathname();
  
  // Predictive caching
  const predictiveCaching = usePredictiveCaching(userId, pathname || '/');
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedResources, setPreloadedResources] = useState<string[]>([]);
  const [layoutType, setLayoutType] = useState<'default' | 'compact' | 'focused' | 'expanded'>('default');
  
  // Toast for notifications
  const { toast } = useToast();
  
  // Preload resources when component mounts or path changes
  useEffect(() => {
    if (preloadResources && userId !== 'anonymous') {
      const loadResources = async () => {
        setIsLoading(true);
        try {
          const result = await predictiveCaching.preloadResources();
          setPreloadedResources(
            result.preloadedResources.map((r: unknown) => r.url)
          );
          
          // Show toast notification for preloaded resources (only in development)
          if (process.env.NODE_ENV === 'development') {
            toast(`Preloaded ${result.preloadedResources.length} resources for faster navigation`);
          }
        } catch (error) {
          console.error('Error preloading resources:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadResources();
    } else {
      setIsLoading(false);
    }
  }, [pathname, userId, preloadResources, predictiveCaching, toast]);
  
  // Determine layout type based on user preferences and behavior
  useEffect(() => {
    if (adaptiveLayout && userId !== 'anonymous') {
      // This would typically be determined by AI based on user behavior
      // For now, we'll use a simple heuristic based on screen size and path
      
      if (isMobile) {
        setLayoutType('compact');
      } else if (pathname?.includes('/app/') || pathname?.includes('/dashboard')) {
        setLayoutType('expanded');
      } else if (pathname?.includes('/lesson/') || pathname?.includes('/assessment/')) {
        setLayoutType('focused');
      } else {
        setLayoutType('default');
      }
    } else {
      setLayoutType('default');
    }
  }, [pathname, isMobile, userId, adaptiveLayout]);
  
  // Layout-specific classes
  const layoutClasses = {
    default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    compact: 'max-w-3xl mx-auto px-4',
    focused: 'max-w-4xl mx-auto px-4 bg-background/80 shadow-sm',
    expanded: 'max-w-full px-4 sm:px-6 lg:px-8',
  };
  
  // Content container classes
  const contentContainerClasses = cn(
    'py-6',
    fullWidth ? 'w-full' : layoutClasses[layoutType],
    contentClassName
  );
  
  // Render loading indicator
  const renderLoadingIndicator = (): void => {
    if (!isLoading) return null;
    
    if (loadingIndicator) {
      return loadingIndicator;
    }
    
    return (
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div className="h-full bg-primary animate-pulse"></div>
      </div>
    );
  };
  
  // Render footer
  const renderFooter = (): void => {
    if (!showFooter || isPrint) return null;
    
    return <Footer />;
  };
  
  // Accessibility features
  const accessibilityStyles = accessibilityFeatures ? (
    <style>
      {`
      /* High contrast focus indicators */
      *:focus-visible {
        outline: 3px solid var(--focus-ring) !important;
        outline-offset: 2px !important;
      }
      
      /* Improved text spacing for readability */
      .improved-readability {
        letter-spacing: 0.01em;
        word-spacing: 0.02em;
        line-height: 1.5;
      }
      
      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
      }
      `}
    </style>
  ) : null;
  
  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      isPrint ? 'print-layout' : '',
      accessibilityFeatures ? 'improved-readability' : ''
    )}>
      {renderLoadingIndicator()}
      
      {showNavigation && !isPrint && (
        <ComprehensiveNavigation />
      )}
      
      <main className="flex-1">
        <div className={contentContainerClasses}>
          {isLoading && !loadingIndicator ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            children
          )}
        </div>
      </main>
      
      {renderFooter()}
      
      {/* Toast notifications */}
      <Toaster />
      
      {/* Accessibility styles */}
      {accessibilityStyles}
      
      {/* Print-specific styles */}
      {isPrint && (
        <style>
          {`
          @media print {
            body {
              font-size: 12pt;
              line-height: 1.5;
              color: #000;
              background: #fff;
            }
            
            .no-print {
              display: none !important;
            }
            
            .print-only {
              display: block !important;
            }
            
            a {
              text-decoration: none;
              color: #000;
            }
            
            /* Ensure page breaks don't occur within elements */
            h1, h2, h3, h4, h5, h6, img, table {
              page-break-inside: avoid;
            }
            
            /* Add page numbers */
            @page {
              margin: 2cm;
            }
          }
          `}
        </style>
      )}
      
      {/* Debug information (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-background/80 border rounded-md p-2 text-xs text-muted-foreground">
          <div>Layout: {layoutType}</div>
          <div>Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</div>
          <div>Preloaded: {preloadedResources.length} resources</div>
        </div>
      )}
    </div>
  );
};

export default AIEnhancedLayout;