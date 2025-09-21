// bayaan-portal/src/components/ErrorBoundary
import {Component, type ErrorInfo, type ReactNode} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {AlertTriangle, Bug, Home, RefreshCw} from 'lucide-react';
import {useAppStore} from "@/store";


interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    level?: 'page' | 'feature' | 'component';
    featureName?: string;
    showErrorDetails?: boolean;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Generate unique error ID for tracking
        const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
            hasError: true,
            error,
            errorId,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const {onError, level = 'component', featureName} = this.props;
        const {errorId} = this.state;

        // Log error details
        console.error('Error Boundary caught an error:', {
            error,
            errorInfo,
            level,
            featureName,
            errorId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
        });

        // Store error info in state
        this.setState({errorInfo});

        // Call custom error handler if provided
        if (onError) {
            onError(error, errorInfo);
        }

        // Add error to global store for monitoring
        const addNotification = useAppStore.getState().addNotification;
        addNotification({
            type: 'error',
            title: 'Application Error',
            message: `An error occurred in ${featureName || 'the application'}. Error ID: ${errorId}`,
        });

        // Report to external error tracking service (e.g., Sentry)
        this.reportError(error, errorInfo, errorId);
    }

    private reportError = (error: Error, errorInfo: ErrorInfo, errorId: string | null) => {
        // TODO: Integrate with external error reporting service
        // Example: Sentry.captureException(error, { extra: errorInfo, tags: { errorId } });

        // For now, just log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.group('🚨 Error Boundary Report');
            console.error('Error:', error);
            console.error('Error Info:', errorInfo);
            console.error('Error ID:', errorId);
            console.error('Component Stack:', errorInfo.componentStack);
            console.groupEnd();
        }
    };

    private handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
        });
    };

    private handleReportBug = () => {
        const {error, errorInfo, errorId} = this.state;
        const {featureName} = this.props;

        const bugReport = {
            errorId,
            featureName,
            error: error?.message,
            stack: error?.stack,
            componentStack: errorInfo?.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
        };

        // Open bug report (could be email, external form, etc.)
        const subject = encodeURIComponent(`Bug Report - Error ID: ${errorId}`);
        const body = encodeURIComponent(`Error Details:\n${JSON.stringify(bugReport, null, 2)}`);
        window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
    };

    render() {
        const {hasError, error, errorId} = this.state;
        const {children, fallback, level = 'component', featureName, showErrorDetails = false} = this.props;

        if (hasError) {
            // Use custom fallback if provided
            if (fallback) {
                return fallback;
            }

            // Render different UI based on error level
            return this.renderErrorUI(level, featureName, error, errorId, showErrorDetails);
        }

        return children;
    }

    private renderErrorUI = (
        level: string,
        featureName: string | undefined,
        error: Error | null,
        errorId: string | null,
        showErrorDetails: boolean
    ) => {
        const isPageLevel = level === 'page';
        const isFeatureLevel = level === 'feature';

        if (isPageLevel) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="space-y-4">
                            <div
                                className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle className="h-8 w-8 text-destructive"/>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-foreground">Oops! Something went wrong</h1>
                                <p className="text-muted-foreground">
                                    We encountered an unexpected error. Please try refreshing the page.
                                </p>
                                {errorId && (
                                    <p className="text-xs text-muted-foreground">
                                        Error ID: {errorId}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={this.handleRetry} className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4"/>
                                Try Again
                            </Button>
                            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                                <Home className="h-4 w-4 mr-2"/>
                                Go Home
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={this.handleReportBug}
                            className="text-muted-foreground"
                        >
                            <Bug className="h-4 w-4 mr-2"/>
                            Report Issue
                        </Button>

                        {showErrorDetails && error && (
                            <Alert variant="destructive" className="text-left">
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertDescription>
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-sm font-medium">
                                            Technical Details
                                        </summary>
                                        <pre className="mt-2 text-xs overflow-auto">
                      {error.message}
                                            {error.stack && `\n\n${error.stack}`}
                    </pre>
                                    </details>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            );
        }

        if (isFeatureLevel) {
            return (
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <div
                            className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="h-6 w-6 text-destructive"/>
                        </div>
                        <CardTitle className="text-lg">
                            {featureName ? `${featureName} Unavailable` : 'Feature Unavailable'}
                        </CardTitle>
                        <CardDescription>
                            This feature is currently experiencing issues. Please try again.
                            {errorId && (
                                <span className="block text-xs mt-2 text-muted-foreground">Error ID: {errorId}</span>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button size="sm" onClick={this.handleRetry}>
                                <RefreshCw className="h-4 w-4 mr-2"/>
                                Retry
                            </Button>
                            <Button variant="outline" size="sm" onClick={this.handleReportBug}>
                                <Bug className="h-4 w-4 mr-2"/>
                                Report Issue
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        // Component level error
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4"/>
                <AlertDescription className="flex items-center justify-between">
                    <span>Component failed to load</span>
                    <Button size="sm" variant="outline" onClick={this.handleRetry}>
                        <RefreshCw className="h-4 w-4 mr-1"/>
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        );
    };
}

export default ErrorBoundary;