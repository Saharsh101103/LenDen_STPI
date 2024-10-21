"use client"
import React, { createContext, useContext, useState } from 'react';

interface BettingContextType {
  currentBet: number;
  placeBet: (amount: number) => void;
  betHistory: number[];
  addToBetHistory: (amount: number) => void;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export const BettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBet, setCurrentBet] = useState(0);
  const [betHistory, setBetHistory] = useState<number[]>([]);

  const placeBet = (amount: number) => {
    setCurrentBet(amount);
    // Add logic for placing bets
  };

  const addToBetHistory = (amount: number) => {
    setBetHistory((prevHistory) => [...prevHistory, amount]);
  };

  return (
    <BettingContext.Provider value={{ currentBet, placeBet, betHistory, addToBetHistory }}>
      {children}
    </BettingContext.Provider>
  );
};

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
};
