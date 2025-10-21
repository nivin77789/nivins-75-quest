import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Trophy } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const Auth = () => {
  const navigate = useNavigate();
  const { signup, login, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [initialWeight, setInitialWeight] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addDays(new Date(), 75), 'yyyy-MM-dd');
      
      await signup(signupEmail, signupPassword, {
        name,
        age: parseInt(age),
        height: parseFloat(height),
        initialWeight: parseFloat(initialWeight),
        startDate: today,
        endDate: endDate,
      });
      
      toast({
        title: "Account created!",
        description: "Your 75 Hard journey begins now!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full gradient-primary mx-auto mb-4">
            <Trophy className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">75 Hard Challenge</h1>
          <p className="text-muted-foreground">Transform yourself in 75 days</p>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Login or create your account to begin your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      min="1"
                      max="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Your height in cm"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                      min="50"
                      max="300"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Initial Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Your current weight in kg"
                      value={initialWeight}
                      onChange={(e) => setInitialWeight(e.target.value)}
                      required
                      min="20"
                      max="300"
                      step="0.1"
                    />
                  </div>
                  <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                    {loading ? 'Creating account...' : 'Start 75 Hard Challenge'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
