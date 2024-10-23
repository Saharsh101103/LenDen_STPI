'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/lib/supabaseClient';  
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaGoogle, FaDiscord } from 'react-icons/fa';
import { Session } from '@supabase/supabase-js';
import { User } from '@supabase/auth-js';

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

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const iconVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.2, rotate: 5 },
};

export default function Component() {
  const [activeTab, setActiveTab] = useState('signin');
  const [bubbles, setBubbles] = useState<JSX.Element[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();  
  const [username, setUsername] = useState('');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setBubbles(Array.from({ length: 10 }, (_, i) => (
      <FloatingBubble key={i} delay={i * 0.5} />
    )));
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const user = session.user;
          handleUserRow(user); // Insert a new row for the user when they log in
          router.push('/dashboard'); // Redirect after login
        }
      }
    );
  
    return () => {

    };
  }, [router]);
  
  const handleUserRow = async (user: User) => {
    const { data, error } = await supabase
      .from('users') // Your users table name
      .select('id')
      .eq('email', user.email);

    if (!data?.length) {
      await supabase
        .from('users')
        .insert({
          email: user.email,
          name: user.user_metadata.full_name || name,
          username: user.user_metadata.username || username,
          cash: 0,
          account_num: null,
          ifsc: null,
        });
    }
  };

  const handleUserSignUp = async () => {
    setLoading(true);
    setError(null);
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          username: username,
        },
      },
    });
  
    if (data.session) {
      const user = data.session.user;
      await handleUserRow(user); 
      router.push('/dashboard');
    }
  
    setLoading(false);
  
    if (error) {
      setError(error.message);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/dashboard`,
      },
    });
  
    if (error) {
      setError(error.message);
    }
  
    setLoading(false);
  };
  
  const handleDiscordSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/dashboard`,
      },
    });
  
    if (error) {
      setError(error.message);
    }
  
    setLoading(false);
  };
  
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
    }
  };
  
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
                  <div className='flex flex-col gap-2'>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button
                        className="w-full h-12 bg-white text-black hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all duration-300 ease-in-out overflow-hidden relative"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                      >
                        <motion.span className="absolute inset-0 bg-black/5 dark:bg-white/5" initial={{ scale: 0, opacity: 0 }} whileHover={{ scale: 2, opacity: 1 }} transition={{ duration: 0.5 }} />
                        <motion.span className="relative z-10 flex items-center justify-center" variants={iconVariants}>
                          <FaGoogle className="mr-2" />
                          {loading ? 'Logging in...' : 'Login with Google'}
                        </motion.span>
                      </Button>
                    </motion.div>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button
                        className="w-full h-12 bg-[#7289da] hover:bg-[#5e73bc] text-white transition-all duration-300 ease-in-out overflow-hidden relative"
                        onClick={handleDiscordSignIn}
                        disabled={loading}
                      >
                        <motion.span className="absolute inset-0 bg-white/10" initial={{ scale: 0, opacity: 0 }} whileHover={{ scale: 2, opacity: 1 }} transition={{ duration: 0.5 }} />
                        <motion.span className="relative z-10 flex items-center justify-center" variants={iconVariants}>
                          <FaDiscord className="mr-2" />
                          {loading ? 'Logging in...' : 'Login with Discord'}
                        </motion.span>
                      </Button>
                    </motion.div>
                  </div>
                </TabsContent>
                <TabsContent value="signup" className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-4">Create Account</h2>
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-white">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleUserSignUp} disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
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
