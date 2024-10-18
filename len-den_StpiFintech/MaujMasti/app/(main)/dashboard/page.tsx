'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { redirect, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

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
  const [isloading, setLoading] = useState(true);


  useEffect(() => {
    const checkUserStatus = async () => {
      const response = await fetch('/api/check_user');
      
      // Check if the response is ok
      if (!response.ok) {
        console.error('Error fetching user status:', response);
        const text = await response.text(); // Log the raw response text
        console.log('Response Text:', text);
        return; // Exit early if the response is not ok
      }

      try {
        const userCheckData = await response.json(); // Safely parse JSON
        
        // Check if redirect is in the response
        if (userCheckData.redirect) {
          router.push(userCheckData.redirect); // Redirect based on API response
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    checkUserStatus();
  }, [router]);

  


  const { user, loading } = useAuth();

  // If loading is true, the session is still being fetched
  if (loading && isloading) {
    return <div>Loading...</div>;
  }

  // Log user once loading is done
  if (user) {
    console.log("Logged in user:", user);
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