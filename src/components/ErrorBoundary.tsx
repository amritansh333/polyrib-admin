import React from 'react';

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<{ children?: React.ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.error('Uncaught error in boundary', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-slate-600">
            An unexpected error occurred. Please reload the page.
          </p>
        </div>
      );
    }
    return this.props.children ?? null;
  }
}
