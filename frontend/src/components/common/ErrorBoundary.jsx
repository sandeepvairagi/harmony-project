import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-sage-50 dark:bg-sage-900 p-8">
          <h1 className="font-display text-3xl text-sage-800 dark:text-sage-100 mb-4">
            Something went wrong
          </h1>
          <p className="text-sage-600 dark:text-sage-300 mb-6">Please refresh or return home.</p>
          <Link
            to="/"
            className="px-6 py-3 bg-sage-600 text-white rounded-full hover:bg-sage-700 transition"
          >
            Go Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
