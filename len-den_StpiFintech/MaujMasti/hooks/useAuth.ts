// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {User} from '@supabase/auth-js'
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
  
    fetchSession();
  
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Session:', session);
      setUser(session?.user ?? null);
  
      if (session?.user) {
        const { email, user_metadata: { user_name } } = session.user;
  
        const { data: existingUser, error: fetchError } = await supabase
          .from('user')
          .select('*')
          .eq('email', email)
          .single();
  
        if (fetchError) {
          console.error('Error fetching user:', fetchError);
          return;
        }
  
        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('user')
            .insert([{
              email,
              name: user_name || 'Anonymous',
              username: user_name || 'User_' + Math.random().toString(36).substring(7),
              cash: 0
            }]);
  
          if (insertError) {
            console.error('Error inserting user:', insertError);
          } else {
            console.log('New user inserted successfully');
          }
        }
      }
    });
  
    // Cleanup listener
    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);
  
  return { user, loading };
};
