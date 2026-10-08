/**
 * ErrorBoundary — Catches React rendering errors
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-forest flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="font-display text-2xl text-cream mb-3">Something went wrong</h2>
            <p className="text-cream/60 text-sm mb-6">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gold text-forest font-medium rounded-xl hover:bg-gold-light transition-colors">
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
