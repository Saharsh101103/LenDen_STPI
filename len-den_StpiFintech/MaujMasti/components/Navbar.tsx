'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Import useRouter
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth';
import Skeleton from './Skeleton'; // Import your skeleton loader

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter(); // Initialize useRouter

  const { user, loading, session } = useAuth();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/'); // Use router.push for redirection
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const balance = user?.cash;

  // If loading is true, render the skeleton
  if (loading) {
    return (
      <nav className="bg-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Skeleton /> {/* Render Skeleton */}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-purple-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/placeholder.svg?height=32&width=32" alt="Logo" />
              <span className="ml-2 text-xl font-bold">MaujMasti</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-800 transition-colors">Games</Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center bg-purple-800 px-3 py-1 rounded-full mr-4">
              <DollarSign className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{balance?.toFixed(2)}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.username} />
                    <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.email ?? 'No Email'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='bg-red-700 text-white'>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/games" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-800 transition-colors">Games</Link>
            <Link href="/leaderboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-800 transition-colors">Leaderboard</Link>
            <Link href="/shop" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-800 transition-colors">Shop</Link>
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center bg-purple-800 px-3 py-1 rounded-full">
                <DollarSign className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{balance?.toFixed(2)}</span>
              </div>
              <Button onClick={handleLogout} variant="destructive" size="sm">Log out</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
