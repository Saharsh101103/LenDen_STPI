import dynamic from "next/dynamic";

const DiamondGame = dynamic(() => import("../components/DiamondGame"), {
  ssr: false,
});

export default function Home(){
  return(
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1  className="text-4xl font-bold text-center">Welcome to Diamond Game</h1>
      <DiamondGame />
    </main>
  );
}