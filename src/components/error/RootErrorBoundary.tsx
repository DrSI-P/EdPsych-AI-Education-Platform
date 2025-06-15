"use client";

import React from 'react';
import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: unknown;
}

// More robust error boundary with recovery
export class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('[RootErrorBoundary] Caught error:', error);
    console.error('[RootErrorBoundary] Error info:', errorInfo);
    this.setState({ errorInfo });
    
    // Report the error to an error tracking service
    // reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-4">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              window.location.href = '/';
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}