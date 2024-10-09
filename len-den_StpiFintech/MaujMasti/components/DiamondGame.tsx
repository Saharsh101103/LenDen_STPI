"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import GameBoard from "./GameBoard";

const TOTAL_TILES = 24;

const DiamondGame: React.FC = () => {
  const [bombCount, setBombCount] = useState<string>("4");
  const [betAmount, setBetAmount] = useState<string>("10");
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const calculateProbability = useCallback(
    (safeClicks: number) => {
      const remainingSafeTiles =
        TOTAL_TILES - parseInt(bombCount) - safeClicks;
      const remainingTotalTiles = TOTAL_TILES - safeClicks;

      return remainingSafeTiles / remainingTotalTiles;
    },
    [bombCount]
  );

  const calculatePayout = useCallback(
    (safeClicks: number) => {
      let payout = parseFloat(betAmount);
      for (let i = 0; i < safeClicks; i++) {
        payout /= calculateProbability(i);
      }
      return payout;
    },
    [betAmount, calculateProbability]
  );

  const handleSafeClick = useCallback(
    (newClickCount: number) => {
      setClickCount(newClickCount);
      const newWinnings = calculatePayout(newClickCount);
      setCurrentWinnings(newWinnings);
    },
    [calculatePayout]
  );

  const handleGameOver = useCallback((isHomeRun: boolean) => {
    setGameOver(true);
    if (!isHomeRun) {
      setCurrentWinnings(0);
    }
    setIsGameStarted(false);
  }, []);

  const handleStartGame = () => {
    const bombCountNum = parseInt(bombCount);
    const betAmountNum = parseFloat(betAmount);

    if (isNaN(bombCountNum) || bombCountNum < 1 || bombCountNum >= TOTAL_TILES) {
      alert("Enter a valid number of bombs (1-24).");
      return;
    }

    if (isNaN(betAmountNum) || betAmountNum <= 0) {
      alert("Enter a valid amount (greater than 0).");
      return;
    }

    setIsGameStarted(true);
    setGameOver(false);
    setCurrentWinnings(0);
    setClickCount(0);
  };

  const handleCashout = () => {
    if (currentWinnings > parseFloat(betAmount)) {
      setGameOver(true);
      setIsGameStarted(false);
      alert(
        `Congratulations !! You've cashed out $${currentWinnings.toFixed(2)}`
      );
    }
  };

  const handleBombCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBombCount(e.target.value);
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">
        {/* Game Settings Section */}
        <div className="w-full md:w-64 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-black">Game Settings</h2>
          <div className="mb-4">
            <label htmlFor="BombCount" className="block mb-2 text-black">
              Number of Bomb Tiles:
            </label>
            <input
              type="number"
              id="BombCount"
              value={bombCount}
              onChange={handleBombCountChange}
              min="1"
              max="24"
              style= {{color : 'black'}}
              className="w-full px-2 py-1 border rounded"
              disabled={isGameStarted}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="betAmount" className="block mb-2 text-black">
              Betting Amount:
            </label>
            <input
              type="number"
              id="betAmount"
              value={betAmount}
              onChange={handleBetAmountChange}
              min="0.01"
              step="0.01"
              style= {{color : 'black'}}
              className="w-full px-2 py-1 border rounded"
              disabled={isGameStarted}
            />
          </div>
          <button
            onClick={handleStartGame}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
            disabled={isGameStarted}
          >
            {isGameStarted ? "Game in Progress" : "Start Game"}
          </button>
          <button
            onClick={handleCashout}
            className={`w-full px-4 py-2 rounded ${
              currentWinnings > parseFloat(betAmount)
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={currentWinnings <= parseFloat(betAmount)}
          >
            Cashout
          </button>
        </div>

        {/* Game Board and Status Section */}
        <div className="w-full w-fit p-4 bg-gray-100 rounded-lg">
          <GameBoard
            bombCount={parseInt(bombCount)}
            onSafeClick={handleSafeClick}
            onGameOver={handleGameOver}
            isGameStarted={isGameStarted}
          ></GameBoard>
          <h2 className="text-xl font-bold mb-4 text-black">Game Status</h2>
          <div className="mb-4">
            <label className="block mb-2 text-black">Current Winnings:</label>
            <p className="text-2xl font-bold text-black">
              ${currentWinnings.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black">Click Count:</label>
            <p className="text-2xl font-bold text-black">{clickCount}</p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black">Game Over:</label>
            <p className="text-2xl font-bold text-black">
              {gameOver ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamondGame;
