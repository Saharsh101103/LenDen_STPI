'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/hooks/useAuth'
import { redirect, useRouter } from 'next/navigation'
import axios from 'axios'

// Sample game data
const games = [
  { id: 1, title: "Space Invaders", genre: "Arcade", players: "1-2", image: "/placeholder.svg?height=200&width=300" },
  { id: 2, title: "Poker Night", genre: "Card", players: "2-6", image: "/placeholder.svg?height=200&width=300" },
  { id: 3, title: "Race to Victory", genre: "Racing", players: "1-4", image: "/placeholder.svg?height=200&width=300" },
  { id: 4, title: "Zombie Survival", genre: "Action", players: "1-8", image: "/placeholder.svg?height=200&width=300" },
  { id: 5, title: "Puzzle Master", genre: "Puzzle", players: "1", image: "/placeholder.svg?height=200&width=300" },
  { id: 6, title: "Fantasy Quest", genre: "RPG", players: "1", image: "/placeholder.svg?height=200&width=300" },
  // Add more games as needed
]



export default function GamesDashboard() {
  const router = useRouter();
  const { user, loading, session } = useAuth();
  const [isloading, setLoading] = useState(true);
  const [user_email, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Wait for user data to be available
    
    if (session) {
      setUserEmail(session.email!);  // Set user email once available
      setLoading(false);  // Stop loading when user data is available
    }
  }, [user]);

  useEffect(() => {
    console.log("Loading state:", loading);
    console.log("Session email:", session?.email);
    console.log("User state:", user);
  const check = async()=>{

    if (!loading && session?.email) {
      try {
        const res = await axios.get(`/api/user-reg?email=${session.email}`)
        console.log("user found", res.data)
        
      } catch (error) {
          console.log("User not found, redirecting to verify");
          router.push(`/verify?email=${session.email}`); // Redirect to verify
      }
    }
  }
  check()
  }, [user, loading, session?.email]);
  

  



  // If loading is true, the session is still being fetched
  if (loading && isloading) {
    return <div>Loading...</div>;
  }

  // Log user once loading is done
  if (session) {
    console.log("Logged in user:", session);
  } else {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Available Games</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="overflow-hidden">
              <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.genre}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{game.players} Players</Badge>
              </CardContent>
              <CardFooter className="bg-gray-50">
                <Button className="w-full">Play Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}