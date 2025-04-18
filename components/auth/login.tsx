'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/'); // Redirect to home page if user is already logged in
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);

      toast({
        title: 'Success!',
        description: 'You have been logged in successfully.',
      });

      // Redirect to dashboard or home page
      router.push('/');
    } catch (error: unknown) {
      let errorMessage = 'Invalid email or password. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-lg rounded">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Log in to your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded"
                />
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 rounded-none cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#0937AB] hover:underline"
              >
                Forgot password?
              </Link>
              <Button
                type="submit"
                className="w-full rounded cursor-pointer bg-[#0937AB] hover:bg-[#0937AB]/90 mt-3"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm font-medium">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-semibold hover:underline text-[#0937AB]"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
