"use client";

import { Component, ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <div className="text-center max-w-md">
            <h1 className="font-heading font-bold text-3xl text-brand-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-brand-gray-600 mb-6">
              We encountered an unexpected error. Please try again later.
            </p>
            <div className="space-y-3">
              <Link href="/" className="btn-primary inline-block">
                Go Home
              </Link>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="btn-outline ml-3"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorBoundary;

