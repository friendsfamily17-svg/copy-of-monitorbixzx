
import React, { ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fixed: Explicitly declare state and props properties to ensure the TypeScript compiler
// correctly identifies them as members of the class, avoiding 'property does not exist' errors.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicit declarations to satisfy compiler checks for inherited members.
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fixed: 'state' is now recognized as a valid property of ErrorBoundary.
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    if (window.confirm("Are you sure? This will delete all local data and reset the application to its initial state.")) {
        localStorage.clear();
        window.location.reload();
    }
  }

  render() {
    // Fixed: 'this.state' is now correctly recognized.
    if (this.state.hasError) {
      return (
        <div className="p-8 text-white bg-slate-900 h-screen flex flex-col items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-lg border border-red-500 max-w-2xl w-full shadow-2xl">
             <h1 className="text-2xl font-bold text-red-500 mb-4 flex items-center"><i className="fas fa-bug mr-2"></i>Something went wrong.</h1>
             <p className="text-slate-300 mb-4">The application encountered an unexpected error. This may be due to corrupted local data.</p>
             <pre className="bg-slate-950 p-4 rounded text-xs font-mono text-red-300 overflow-auto max-h-64 whitespace-pre-wrap mb-6 border border-slate-700">
                {/* Fixed: Accessing 'error' from the component's state. */}
                {this.state.error?.toString()}
             </pre>
             <div className="flex gap-4 justify-center">
                 <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">
                    <i className="fas fa-sync-alt mr-2"></i>Reload Application
                 </button>
                 <button onClick={this.handleReset} className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition-colors shadow-lg">
                    <i className="fas fa-trash-alt mr-2"></i>Factory Reset (Clear Data)
                 </button>
             </div>
          </div>
        </div>
      );
    }

    // Fixed: 'this.props' is now correctly recognized.
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
