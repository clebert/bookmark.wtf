import type {ComponentChild, ComponentChildren} from 'preact';
import {Component} from 'preact';

export interface ErrorBoundaryProps {
  readonly fallback: ComponentChild;
}

export interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static override getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    console.error(error);

    return {hasError: true};
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {hasError: false};
  }

  render(): ComponentChildren {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
