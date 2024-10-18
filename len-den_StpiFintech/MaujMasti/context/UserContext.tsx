// /app/context/UserContext.tsx
'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const UserContext = createContext<User | null>(null);
type User = {
    email: string;
    name: string;
    username: string;
    // Add any other user fields here
  };

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const email = session.user?.email;

        // Fetch the user data from the database
        const { data: userData } = await supabase
          .from('user')
          .select('*')
          .eq('email', email)
          .single();

        setUser(userData);
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
