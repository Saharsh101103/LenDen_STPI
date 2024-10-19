// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/auth-js';
import axios from 'axios';

interface User_Details {
  id: number;
  email: string;
  name: string | null;
  username: string;
  cash: number;
  account_num: string | null;
  ifsc: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const useAuth = () => {
  const [session, setSession] = useState<User | null>(null);
  const [user, setUser] = useState<User_Details | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    // Cleanup listener
    return () => {};
  }, []);

  // Fetch user details based on email
  const fetchUserDetails = async (email: string | undefined) => {
    if (!email) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/user-reg?email=${email}`);

      if (response.status === 200) {
        const userDetails = response.data.user;
        setUser(userDetails);
      } else {
        setUser(null);  // Handle non-200 responses
      }
    } catch (error) {
      console.error("Error fetching user details:", error); // Improved error logging
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details when session email changes
  useEffect(() => {
    if (session?.email) {
      fetchUserDetails(session.email);
    }
  }, [session?.email]);

  return { user, loading, session };
};