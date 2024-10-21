// Game.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DiamondGame from "@/components/DiamondGame";
import Sidebar from "@/components/Sidebar"; // Import Sidebar
import { Provider } from 'react-redux';
export default function Game() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
      }
    };

    checkSession();
  }, [router]);

  return (
      <main className="flex">
        <div className="flex-1 flex flex-col items-center justify-between md:p-24 p-12">
          <h1 className="text-4xl font-bold text-center">{`Welcome to Diamond Game`}</h1>
          <DiamondGame />
        </div>
      </main>
  );
}
