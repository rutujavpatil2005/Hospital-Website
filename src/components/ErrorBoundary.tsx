import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            isFirestoreError = true;
            errorMessage = `Database Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path || 'unknown path'}`;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#0B3C5D] mb-4">Something went wrong</h2>
            <div className="bg-red-50 p-4 rounded-xl mb-6 text-left">
              <p className="text-sm text-red-700 font-mono break-words">{errorMessage}</p>
              {isFirestoreError && (
                <p className="text-xs text-red-500 mt-2 italic">
                  Tip: Check your Firebase Security Rules and ensure you are logged in with the correct permissions.
                </p>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#0B3C5D] text-white py-3 rounded-xl font-bold hover:bg-[#082d46] transition-all flex items-center justify-center space-x-2"
            >
              <RefreshCcw className="h-5 w-5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
