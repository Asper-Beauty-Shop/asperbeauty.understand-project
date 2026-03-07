import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASPER_PROTOCOL } from "@/lib/asperProtocol";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Optional: Integrate Sentry (sentry.io) or server-side logging.
    // Supabase: use log-telemetry with source "concierge" and event "client_error" (requires TELEMETRY_INGEST_SECRET server-side).
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Brief technical interruption
            </h1>
            <p className="text-muted-foreground mb-6">
              {ASPER_PROTOCOL.errorFull.en}
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => window.location.reload()}
                className="w-full gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Application
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/contact">Contact Concierge</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
