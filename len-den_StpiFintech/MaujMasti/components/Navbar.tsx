'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Menu, X, DollarSign, Trash, ShoppingCartIcon } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import Skeleton from './Skeleton'
import Image from 'next/image'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const { user, loading, session } = useAuth()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const balance = user?.cash ?? 0

  if (loading) {
    return (
      <nav className="bg-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Skeleton />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-purple-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="/MM_logo.png" alt="MaujMasti Logo" width={75} height={75} />
              <span className="ml-2 text-xl font-bold">MaujMasti</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-800 transition-colors">
                Games
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center space-x-2">
            <div className='flex space-x-2'>

          <Link className="flex items-center bg-purple-800 px-3 py-1 rounded-full hover:bg-opacity-80" href={'/shop'}>
                <ShoppingCartIcon className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">Shop</span>
              </Link>
            <div className="flex items-center bg-purple-800 px-3 py-1 rounded-full mr-4">
              <DollarSign className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{balance.toFixed(2)}</span>
            </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user_metadata.avatar_url} alt={user?.username} />
                    <AvatarFallback className="text-black">
                      {user?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.email ?? 'No Email'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="bg-red-700 hover:bg-red-900 hover:cursor-pointer text-white flex items-center">
                  <Trash className="mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      
    </nav>
  )
}
