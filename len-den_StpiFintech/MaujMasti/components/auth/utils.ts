import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export const handleSignUp = async (email: string, password: string, name: string, username: string) => {
  // Sign up with email and password
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, username }
    },
  });

  if (error) {
    return { error };
  }

  // Create user entry in the "users" table if the user is successfully signed up
  if (data?.user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email,
          name,
          username,
          cash: 0,  // Default value for cash
          account_num: null,
          ifsc: null,
        },
      ]);

    if (insertError) {
      return { error: insertError.message };
    }
  }

  return { data };
};

