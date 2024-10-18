import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  // Check if there was an error getting the session or if the session is null
  if (sessionError || !session?.user) {
    return NextResponse.redirect('/login'); // Redirect to login if no user
  }

  const { data, error } = await supabase
    .from('user') // Ensure the table name is correct
    .select('isVerified')
    .eq('email', session.user.email) // Access user from session
    .single();

  // Handle errors or data not found
  if (error || !data) {
    return NextResponse.redirect('/verify'); // Redirect to verify if user not found
  }

  if (!data.isVerified) {
    return NextResponse.redirect('/verify'); // Redirect if not verified
  }

  return NextResponse.next(); // Proceed to the dashboard if verified
}
