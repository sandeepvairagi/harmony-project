import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleClearAndReload = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-sage-50 dark:bg-sage-900 p-8 text-center">
          <h1 className="font-display text-3xl text-sage-800 dark:text-sage-100 mb-4">
            Something went wrong
          </h1>
          <p className="text-sage-600 dark:text-sage-300 mb-6 max-w-md">
            An unexpected error occurred. Please refresh or reset session to continue.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-sage-600 text-white rounded-full hover:bg-sage-700 transition"
            >
              Refresh Page
            </button>
            <button
              onClick={this.handleClearAndReload}
              className="px-6 py-3 border border-sage-600 text-sage-700 dark:text-sage-200 rounded-full hover:bg-sage-100 dark:hover:bg-sage-800 transition"
            >
              Reset Session & Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
