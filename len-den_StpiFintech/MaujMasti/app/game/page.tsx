import dynamic from "next/dynamic";
import { supabase } from '../../lib/supabaseClient';
import { redirect } from 'next/navigation';

const DiamondGame = dynamic(() => import("../../components/DiamondGame"), {
  ssr: false,
});

export default async function Game() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login'); // Redirect to login page if not authenticated
  }

  return(
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-12">
      <h1  className="text-4xl font-bold text-center">Welcome to Diamond Game</h1>
      <DiamondGame />
    </main>
  );
}

