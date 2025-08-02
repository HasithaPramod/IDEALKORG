import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, Chrome } from 'lucide-react';
import { sanitizeInput, validateEmail, validatePasswordStrength, rateLimiter, logSecurityEvent } from '@/lib/security';
import { AdvancedLoginPageSEO } from '@/components/AdvancedSEOHead';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle, isAdmin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Rate limiting check
    const clientIP = 'client'; // In a real app, get actual IP
    if (!rateLimiter.isAllowed(clientIP, 5, 300000)) { // 5 attempts per 5 minutes
      setError('Too many login attempts. Please try again later.');
      logSecurityEvent('Login rate limit exceeded', { email }, 'medium');
      return;
    }

    // Input validation and sanitization
    const sanitizedEmail = sanitizeInput(email, 254);
    const sanitizedPassword = sanitizeInput(password, 128);

    if (!sanitizedEmail || !sanitizedPassword) {
      setError('Please provide both email and password.');
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    const passwordValidation = validatePasswordStrength(sanitizedPassword);
    if (!passwordValidation.valid) {
      setError('Password does not meet security requirements.');
      logSecurityEvent('Weak password attempt', { email: sanitizedEmail }, 'low');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(sanitizedEmail, sanitizedPassword);
      navigate('/admin');
      logSecurityEvent('Successful login', { email: sanitizedEmail }, 'low');
    } catch (error: any) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
      logSecurityEvent('Failed login attempt', { email: sanitizedEmail, error: error.message }, 'medium');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate('/admin');
      logSecurityEvent('Successful Google login', {}, 'low');
    } catch (error: any) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google login error:', error);
      logSecurityEvent('Failed Google login attempt', { error: error.message }, 'medium');
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <>
      <AdvancedLoginPageSEO />
      <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the admin dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                {googleLoading ? 'Signing in...' : 'Sign in with Google'}
              </Button>
            </div>

            {isAdmin && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Admin access detected
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};

export default Login; 