import * as React from 'react';

export interface ErrorBoundaryProps extends React.PropsWithChildren {
  readonly fallback: React.ReactNode;
}

export interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    console.error(error);

    return {hasError: true};
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {hasError: false};
  }

  override render(): React.ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
