'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import { redirect, useRouter } from 'next/navigation'
import axios from 'axios'
import { Loader } from '@/components/Loading'
import { motion } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from 'next/link'

// Sample game data
interface Game {
  id: number
  title: string
  image: string
  genre: string
  link: string
}

const games: Game[] = [
  { id: 1, title: "Diamond Miner", image: "/DiamondMiner.png?height=600&width=400", genre: "Chance to find diamonds but at your own risk!", link: "/game/DiamondMiner" },
  { id: 2, title: "Memory Mayhem", image: "/game1.png?height=600&width=400", genre: `Let us see how good your memory is!`, link: "/game/MemoryMayhem" },
  { id: 3, title: "Urban Racer", image: "/game2.png?height=600&width=400", genre: "Racing", link: "/" },
]

export default function GamesDashboard() {
  const router = useRouter();
  const { user, loading, session } = useAuth();
  const [isloading, setLoading] = useState(true);
  const [user_email, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "center" })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return // return early if emblaApi is not available
    
    // Set up the event handler
    emblaApi.on("select", onSelect)
    
    // Cleanup function that removes the event listener
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    // Simulate loading logic
    const loadDashboardData = async () => {
      // Fetch data here
      setTimeout(() => {
        setIsLoading(false); // After data is fetched, stop loading
      }, 3000); // Simulating a 3-second load
    };

    loadDashboardData();
  }, []);

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
    const check = async () => {
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
  if (isLoading) {
    return (
      <div className='h-screen w-full flex justify-center items-center'>
        <Loader isLoading={isLoading} />
      </div> 
    )
  }

  // Log user once loading is done
  if (session) {
    console.log("Logged in user:", session);
  } else {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-darker)] text-[var(--color-light)]">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold">Featured Games</h2>
        <div className="relative overflow-hidden">
          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  className={`flex-[0_0_60%] min-w-0 md:flex-[0_0_40%] p-2 transition-all duration-300 ease-in-out ${
                    selectedIndex === index
                      ? "scale-100 z-10 opacity-100"
                      : "scale-75 opacity-30 blur-[1px]"
                  }`}
                  style={{
                    transform: `scale(${selectedIndex === index ? 1 : 0.75})`,
                  }}
                >
                  <Link className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer shadow-lg" href={game.link}>
                    <img src={game.image} alt={game.title} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-4">
                      <div>
                        <h3 className="text-xl font-semibold">{game.title}</h3>
                        <p className="text-sm text-[var(--color-muted)]">{game.genre}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20"
            onClick={scrollNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </main>
    </div>
  )
}
