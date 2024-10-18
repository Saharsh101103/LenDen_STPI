"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error('Failed to get session');
      }

      const user = data?.session?.user; // Safely get the user

      if (!user) {
        throw new Error('No user logged in');
      }

      // Update the user's verification status
      const { error: updateError } = await supabase
        .from('users')
        .update({ name, username, isVerified: true })
        .eq('email', user.email);

      if (updateError) {
        setError('Error updating user data');
        return;
      }

      // Redirect to dashboard after successful verification
      router.push('/dashboard');
    } catch (err) {
      setError(error || 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Verify Your Account</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
