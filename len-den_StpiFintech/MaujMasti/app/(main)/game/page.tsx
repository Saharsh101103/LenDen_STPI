'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import DiamondGame from '@/components/DiamondGame';

export default function Game() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      

      if (!session) {
        // Redirect if no session is found
        router.push('/auth');
      }
    };

    checkSession();

    // Optional: Listen for session changes


    // Clean up the listener
    
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-12">
      <h1 className="text-4xl font-bold text-center">
        {`Welcome to Diamond Game`}
      </h1>
      <DiamondGame />
    </main>
  );
}




