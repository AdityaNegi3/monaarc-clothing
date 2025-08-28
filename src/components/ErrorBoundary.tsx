// src/components/ErrorBoundary.tsx
import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string; stack?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, message: String(err) };
  }

  componentDidCatch(error: any, info: any) {
    // Only log verbose info in dev
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("App crashed:", error, info);
    }
    this.setState({ stack: error?.stack });
  }

  reset = () => this.setState({ hasError: false, message: undefined, stack: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "ui-sans-serif", color: "#fff", background: "#111", minHeight: "100vh" }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something broke 🤕</h1>
          <pre style={{ whiteSpace: "pre-wrap", opacity: 0.9 }}>{this.state.message}</pre>

          {import.meta.env.DEV && this.state.stack && (
            <>
              <div style={{ margin: "12px 0" }}>Stack:</div>
              <pre style={{ whiteSpace: "pre-wrap", opacity: 0.7 }}>{this.state.stack}</pre>
            </>
          )}

          <button
            onClick={this.reset}
            style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "#eab308", color: "#111", fontWeight: 600 }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
