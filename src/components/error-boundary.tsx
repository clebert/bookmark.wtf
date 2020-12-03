import * as React from 'react';

export interface ErrorBoundaryProps {
  readonly fallback: React.ReactNode;
}

export interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(): ErrorBoundaryState {
    return {hasError: true};
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {hasError: false};
  }

  render(): JSX.Element {
    return this.state.hasError ? (
      <>{this.props.fallback}</>
    ) : (
      <>{this.props.children}</>
    );
  }
}
