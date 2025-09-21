// bayaan-portal/src/pages/Auth/Login
import React, {useEffect} from 'react';
import {useAuth} from '@/hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {AlertTriangle, GalleryVerticalEnd, LogIn, RefreshCw} from 'lucide-react';
import {useLocalizedContent} from '@/hooks/useLocalizedContent';
import placeholderImg from '@/assets/imgs/placeholder.svg';

const Login: React.FC = () => {
    const {
        login,
        isAuthenticated,
        isLoginPending,
        loginError,
        isInitializing,
        initError,
        retryAuth,
        authInitialized,
    } = useAuth();
    const navigate = useNavigate();
    const {t} = useLocalizedContent({namespace: 'auth'});

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && authInitialized) {
            console.log('User already authenticated, redirecting to dashboard');
            navigate('/dashboard', {replace: true});
        }
    }, [isAuthenticated, authInitialized, navigate]);

    const handleLogin = () => {
        login();
    };

    const handleRetry = () => {
        retryAuth();
    };

    // Show initialization error
    if (initError && !isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-destructive">
                            {t('errors.initFailed', {defaultValue: 'Authentication Error'})}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertDescription>
                                {initError.message || 'Failed to initialize authentication service'}
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={handleRetry}
                            variant="outline"
                            className="w-full"
                        >
                            <RefreshCw className="w-4 h-4 mr-2"/>
                            Retry Initialization
                        </Button>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="default"
                            className="w-full"
                        >
                            <RefreshCw className="w-4 h-4 mr-2"/>
                            Reload Page
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex items-center space-x-2">
                                <GalleryVerticalEnd className="h-6 w-6"/>
                                <span className="font-bold text-xl">Bayaan App</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold">
                            {t('login.title', {defaultValue: 'Welcome to Bayaan'})}
                        </h1>
                    </div>

                    <div className="grid gap-4">
                        {/* Show initialization loading */}
                        {isInitializing && (
                            <div className="text-center space-y-2">
                                <div
                                    className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"/>
                                <p className="text-sm text-muted-foreground">
                                    {t('loading.auth', {defaultValue: 'Connecting to authentication service...'})}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {t('loading.authSubtitle', {defaultValue: 'Using secure redirect-based authentication'})}
                                </p>

                                {/* Add timeout button for stuck initialization */}
                                <div className="mt-4">
                                    <Button
                                        onClick={handleRetry}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        <RefreshCw className="w-3 h-3 mr-1"/>
                                        Retry
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Show login error */}
                        {loginError && !isInitializing && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertDescription>
                                    {loginError.message || t('errors.loginFailed', {defaultValue: 'An error occurred during login'})}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Login button */}
                        {!isInitializing && authInitialized && (
                            <div className="space-y-4">
                                <Button
                                    onClick={handleLogin}
                                    disabled={isLoginPending}
                                    className="w-full"
                                >
                                    {isLoginPending ? (
                                        <>
                                            <div
                                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"/>
                                            {t('login.submitting', {defaultValue: 'Redirecting...'})}
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4 mr-2"/>
                                            {t('login.submit', {defaultValue: 'Sign In'})}
                                        </>
                                    )}
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    <p>{t('login.redirectNote', {defaultValue: 'You will be redirected to authentication server for secure authentication'})}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src={placeholderImg}
                    alt="Login illustration"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
};

export default Login;