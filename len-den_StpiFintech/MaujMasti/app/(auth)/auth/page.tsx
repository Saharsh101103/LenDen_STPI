'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use for redirection after successful login/signup
import { supabase } from '@/lib/supabaseClient';  // Import your supabase client
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { handleSignUp } from '@/components/auth/utils'; // Import your auth logic

const FloatingBubble = ({ delay = 0 }) => (
  <motion.div
    className="absolute rounded-full bg-white bg-opacity-10"
    initial={{ scale: 0, x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }}
    animate={{
      scale: [0, 1, 1, 0],
      x: [null, Math.random() * 200 - 100],
      y: [null, Math.random() * 200 - 100],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      repeatType: 'loop',
    }}
    style={{
      width: Math.random() * 60 + 20,
      height: Math.random() * 60 + 20,
    }}
  />
);

export default function Component() {
  const [activeTab, setActiveTab] = useState('signin');
  const [bubbles, setBubbles] = useState<JSX.Element[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error handling
  const router = useRouter();  // Move useRouter to the component

  const [username, setUsername] = useState(''); // Username state for sign-up

  useEffect(() => {
    setBubbles(Array.from({ length: 10 }, (_, i) => (
      <FloatingBubble key={i} delay={i * 0.5} />
    )));
  }, []);

  // Sign in logic
  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // Redirect after successful login
      router.push('/dashboard'); // Change to your desired route
    }
  };

  // Sign up logic
  const handleUserSignUp = async () => {
    setLoading(true);
    setError(null);
    const { error } = await handleSignUp(email, password, name, username); // Removed router from utils
    setLoading(false);

    if (error) {
      setError(error.toString);
    } else {
      router.push('/dashboard');  // Redirect after successful signup
    }
  };

  // Sign in and sign up buttons disabled state
  const isButtonDisabled = loading || !email || !password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900 p-4 overflow-hidden">
      {bubbles}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <div className="mt-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="signin" className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">Welcome Back</h2>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleSignIn} disabled={isButtonDisabled}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">Create an Account</h2>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-white">Username</Label>
                    <Input
                      id="signup-username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleUserSignUp} disabled={isButtonDisabled}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}
