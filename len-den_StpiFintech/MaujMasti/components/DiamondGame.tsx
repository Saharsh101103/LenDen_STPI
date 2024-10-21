'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import axios from 'axios'

interface DiamondGameProps {
  gameState: 'betting' | 'playing' | 'ended';
  setGameState: React.Dispatch<React.SetStateAction<'betting' | 'playing' | 'ended'>>;
  bettingAmount: number;
  setBettingAmount: React.Dispatch<React.SetStateAction<number>>;
  newCash: number;
}

const DiamondGame: React.FC<DiamondGameProps> = ({
  gameState,
  setGameState,
  bettingAmount,
  setBettingAmount,
  newCash,
}) => {
  const { user } = useAuth();
  const [diamonds, setDiamonds] = useState<number[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [message, setMessage] = useState('');

  // Function to start the diamond game
  const startGame = async () => {
    try {
      const res = await axios.post('/api/start-diamond-game', {
        userId: user?.id,
        betAmount: bettingAmount,
      });

      if (res.data.success) {
        setIsGameActive(true);
        setGameState('playing');
        setDiamonds(res.data.diamonds);
        setMessage('Game started! Click on diamonds to win!');
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      console.error('Error starting the diamond game:', error);
      setMessage('Failed to start the game. Please try again.');
    }
  };

  // Function to handle diamond click
  const handleDiamondClick = (diamondIndex: number) => {
    // Logic to handle diamond click (win/lose)
    setIsGameActive(false);
    setGameState('ended');
    // Update user's cash, notify results, etc.
    setMessage(`You clicked diamond ${diamondIndex + 1}!`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {gameState === 'betting' && (
        <motion.button
          onClick={startGame}
          className="py-2 px-4 bg-blue-500 text-white rounded-md"
          whileHover={{ scale: 1.05 }}
        >
          Start Diamond Game
        </motion.button>
      )}

      {gameState === 'playing' && (
        <div className="flex space-x-4">
          {diamonds.map((diamond, index) => (
            <motion.div
              key={index}
              className="w-16 h-16 bg-yellow-500 flex items-center justify-center rounded-md cursor-pointer"
              onClick={() => handleDiamondClick(index)}
              whileHover={{ scale: 1.1 }}
            >
              {diamond}
            </motion.div>
          ))}
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center mt-4">
          <p>{message}</p>
          <Button
            onClick={() => {
              setGameState('betting');
              setBettingAmount(0);
              setDiamonds([]);
              setMessage('');
            }}
            className="mt-4"
          >
            New Game
          </Button>
        </div>
      )}
    </div>
  );
};

export default DiamondGame;
