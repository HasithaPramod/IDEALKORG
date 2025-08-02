import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, Shield } from 'lucide-react';
import { AdvancedUnauthorizedPageSEO } from '@/components/AdvancedSEOHead';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <>
      <AdvancedUnauthorizedPageSEO />
      <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have permission to access this page
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Access Required
            </CardTitle>
            <CardDescription>
              This area is restricted to authorized administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>If you believe you should have access to this area:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Contact your system administrator</li>
                <li>Ensure you're using the correct account</li>
                <li>Check if your account has been granted admin privileges</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              <Button
                onClick={() => navigate('/login')}
                className="flex-1"
              >
                Try Different Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};

export default Unauthorized; 