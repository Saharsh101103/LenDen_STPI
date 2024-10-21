'use client'

import React, { useState, useEffect, SetStateAction } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Gamepad2, Home, Trophy, Users, Settings, Menu, X, BadgeDollarSign } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import axios from 'axios'
import { Sparkles, Zap, Footprints, Bomb } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface StartGameResponse {
  start: boolean;
  response: string;
}
const navItems = [
  { icon: Home, label: 'Home', link: '/' },
  { icon: Gamepad2, label: 'Dashboard', link: '/dashboard' },
]

interface GamingSidebarProps {
  defaultOpen?: boolean
  accentColor?: string
  userName?: string
  isstepsLimit?: boolean;
  ismineCount?: boolean;
  game: string;
  gameState: 'betting' | 'playing' | 'ended';
  bettingAmount:number
  stepsLimit?:number
  mines?:number
  message: string
  setGameState?: React.Dispatch<React.SetStateAction<'betting' | 'playing' | 'ended'>>
  setBettingAmount?: React.Dispatch<React.SetStateAction<number>>
  setStepsLimit?: React.Dispatch<React.SetStateAction<number>>
  setMineCount?: React.Dispatch<React.SetStateAction<number>>
  setMessage?: React.Dispatch<React.SetStateAction<string>>
  initializeGame: (() => void),
  newCash: number,
}


export default function GamingSidebar({
  accentColor = '#123k1j',
  defaultOpen = false,
  isstepsLimit,
  ismineCount,
  game,
  gameState,
  setGameState,
  bettingAmount,
  setBettingAmount,
  message,
  setMessage,
  stepsLimit,
  setStepsLimit,
  initializeGame,
  setMineCount,
  mines,
  newCash
}: GamingSidebarProps) {
  const { user, session } = useAuth()
  const userName = user?.username ?? "user"
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMobile, setIsMobile] = useState(false)
  const [isGameOn, setIsGameOn] = useState(false)
  const [userMoney, setUserMoney] = useState(0)
  

  
  const handleStartGame = async (
    game: string,
    bettingAmount: number,
    setGameState?: React.Dispatch<React.SetStateAction<'betting' | 'playing' | 'ended'>>
  ) => {
    try {
      const res = await axios.post<StartGameResponse>('/api/start-game', {
        gameType: game,
        betAmount: bettingAmount,
        user,
      });
  
      const { start, response } = res.data;
  
      if (start && setGameState) {
        setGameState('playing');
        setIsGameOn(true)
        console.log("Setting state to 'playing' ");
      }
      if(setMessage){
        setMessage(response)
      }
      console.log('Game started:', start, response); // Log this instead
    } catch (error) {
      console.error('Error starting the game:', error);
    }
  };

  
  // Using useEffect to log the updated state
  useEffect(() => {
    console.log(gameState, "Updated State");
  }, [gameState]);
  
  
  // Logging state updates in useEffect
  useEffect(() => {
    console.log(gameState, "Updated State");
  }, [gameState]);
  

  useEffect(() => {
    if(gameState === "ended"){
      handleEndGame(newCash)
    }
}, [gameState]);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  const handleEndGame = async (results: number) => {
    try {
      const response = await axios.post('/api/end-game', {
        gameType: game,
        results: newCash,
        user
      });
      setIsGameOn(false)
      setUserMoney(parseInt(response.data.returnResult))
      console.log('Cash updated:', response.data);
    } catch (error) {
      console.error('Error ending the game:', error);
    }
  };


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => setIsOpen(!isOpen)


  useEffect(() => {
    setUserMoney(user?.cash!)
    }, [user?.cash])
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={`fixed top-4 left-4 z-50 transition-all duration-300 ease-in-out ${isOpen && isMobile ? 'left-[256px]' : 'left-4'
          } ${isMobile ? 'block' : 'hidden'}`}
        onClick={toggleSidebar}
        style={{ backgroundColor: accentColor, color: 'white' }}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white p-5 flex flex-col justify-between ${isMobile ? 'shadow-lg' : ''
              }`}
          >
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-10"
                style={{ color: accentColor }}
              >
                MaujMasti
              </motion.div>

              <nav className='mb-14'>
                <ul className="space-y-4 ">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.link}
                        className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                      >
                        <item.icon className="h-6 w-6" style={{ color: accentColor }} />
                        <span>{item.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="flex items-center justify-center my-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-opacity-50 backdrop-blur-lg rounded-xl p-1 w-full max-w-md space-y-6 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 2 }}
                  >
                    {[...Array(50)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          width: `${Math.random() * 3}px`,
                          height: `${Math.random() * 3}px`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: Math.random() * 3 + 2,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      />
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4 relative z-10"
                  >
                    <div className="space-y-2">
                      <label htmlFor="bettingAmount" className="block text-sm font-medium text-gray-200">
                        Betting Amount
                      </label>
                      <div className="relative">
                        <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500" size={18} />
                        <input
                          type="number"
                          id="bettingAmount"
                          value={bettingAmount}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10); // Get the value as an integer
                            if (value >= 0 && setBettingAmount) {
                              setBettingAmount(value); // Only set the state if value is 16 or greater
                            }
                          }}
                          className="pl-10 w-full px-4 py-2 bg-gray-700 bg-opacity-50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter betting amount"
                        />
                      </div>
                    </div>

                    {isstepsLimit ?
                      <div className="space-y-2">
                        <label htmlFor="stepsLimit" className="block text-sm font-medium text-gray-200">
                          Steps Limit
                        </label>
                        <div className="relative">
                          <Footprints className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
                          <input
                            type="number"
                            id="stepsLimit"
                            value={stepsLimit}
                            onChange={(e) =>  {
                              const value = parseInt(e.target.value, 10); // Get the value as an integer
                              if (value >= 0 && setStepsLimit) {
                                setStepsLimit(value); // Only set the state if value is 16 or greater
                              }
                            }}
                            className="pl-10 w-full px-4 py-2 bg-gray-700 bg-opacity-50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter steps limit"
                          />
                        </div>
                      </div>
                      : <div></div>}
                    {ismineCount ?
                      <div className="space-y-2">
                        <label htmlFor="mineCount" className="block text-sm font-medium text-gray-200">
                          Mine Count
                        </label>
                        <div className="relative">
                          <Bomb className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
                          <input
                            type="number"
                            id="mineCount"
                            value={mines}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10); // Get the value as an integer
                              if (value >= 1 && value < 25 && setMineCount) {
                                setMineCount(value); 
                                console.log("MINES =", mines)
                              }
                            }}
                            min={1} // Restrict the minimum value to 16
                            className="pl-10 w-full px-4 py-2 bg-gray-700 bg-opacity-50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter mine count"
                          />
                        </div>
                      </div> : <div>

                      </div>
                    }
                  </motion.div>

                  {gameState == "ended" ? <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => {
                      initializeGame();
                      if(setGameState)
                      {
                        setGameState('betting');
                      }
                    }}
                    className="w-full py-3 px-4 disabled:hover:bg-current bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-300 relative z-10"
                  >
                    <span className="flex items-center justify-center">
                      <Gamepad2 className="mr-2" size={20} />
                      {'New Game'}
                    </span>
                  </motion.button> : <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    disabled = {isGameOn}
                    transition={{ delay: 0.4 }}
                    onClick={() => {handleStartGame(game!, bettingAmount, setGameState)}}
                    className="w-full py-3 px-4 disabled:hover:bg-current bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-300 relative z-10"
                  >
                    <span className="flex items-center justify-center">
                      <Zap className="mr-2" size={20} />
                      {isGameOn ? 'Running' : 'Start Game'}
                    </span>
                  </motion.button>}
                </motion.div>
              </div>

            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto"
            >
              <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
              <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user_metadata.avatar_url} alt={user?.username} />
                    <AvatarFallback className="text-black">
                      {user?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                <div>
                  <div className="font-medium">{userName}</div>
                  <div className="text-sm text-gray-400">Online</div>
                </div>
              </div>
            </motion.div>
            <motion.div className='flex justify-between items-center p-4'>
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <BadgeDollarSign className="h-6" style={{ color: accentColor }} />
                <span>Credits</span>
              </div>
              <div className='p-2 border rounded-full'>
                 {`$ ${user ? userMoney : 0}`}
              </div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}