import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-white bg-slate-900 h-screen flex flex-col items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-lg border border-red-500 max-w-2xl w-full">
             <h1 className="text-2xl font-bold text-red-500 mb-4"><i className="fas fa-bug mr-2"></i>Something went wrong.</h1>
             <p className="text-slate-300 mb-4">The application encountered an unexpected error.</p>
             <pre className="bg-slate-950 p-4 rounded text-xs font-mono text-red-300 overflow-auto max-h-64 whitespace-pre-wrap">
                {this.state.error?.toString()}
             </pre>
             <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">
                Reload Application
             </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
  </React.StrictMode>
);