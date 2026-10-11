import { Component } from 'react';

// Keeps the portfolio usable if a decorative/interactive graphic fails to render.
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error(error);
  }
  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}
