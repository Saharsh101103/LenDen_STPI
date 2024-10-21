"use client";
import React, { useState, useCallback } from "react";
import GameBoard from "./GameBoard";
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8"
      >
        {/* Game Settings Section */}
        <div
          className="w-full md:w-64 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          style={{
            backgroundColor: 'var(--container-bg-color)',
            boxShadow: `0 4px 8px var(--shadow-color)`,
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--heading-color)' }}
          >
            Game Settings
          </h2>
          <div className="mb-4">
            <label
              htmlFor="BombCount"
              className="block mb-2"
              style={{ color: 'var(--label-color)' }}
            >
              Number of Bomb Tiles:
            </label>
            <input
              type="number"
              id="BombCount"
              value={bombCount}
              onChange={handleBombCountChange}
              min="1"
              max="24"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-color)',
              }}
              disabled={isGameStarted}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="betAmount"
              className="block mb-2"
              style={{ color: 'var(--label-color)' }}
            >
              Betting Amount:
            </label>
            <input
              type="number"
              id="betAmount"
              value={betAmount}
              onChange={handleBetAmountChange}
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-color)',
              }}
              disabled={isGameStarted}
            />
          </div>
          <button
            onClick={handleStartGame}
            className="w-full text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 transition"
            style={{
              background: `linear-gradient(to right, var(--button-bg-gradient-start), var(--button-bg-gradient-end))`,
            }}
            disabled={isGameStarted}
          >
            {isGameStarted ? "Game in Progress" : "Start Game"}
          </button>
          <button
            onClick={handleCashout}
            className={`w-full mt-4 px-4 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 transition ${
              currentWinnings > parseFloat(betAmount)
                ? "text-white"
                : "text-gray-600 cursor-not-allowed"
            }`}
            style={{
              background: currentWinnings > parseFloat(betAmount)
                ? `linear-gradient(to right, var(--cashout-bg-gradient-start), var(--cashout-bg-gradient-end))`
                : 'var(--disabled-bg-color)',
            }}
            disabled={currentWinnings <= parseFloat(betAmount)}
          >
            Cashout
          </button>
        </div>

        {/* Game Board and Status Section */}
        <motion.div
          initial={{ x: 200 }}
          animate={{ x: 0 }}
          className="w-full w-fit p-4 rounded-lg shadow-lg transition-all"
          style={{
            backgroundColor: 'var(--container-bg-color)',
            boxShadow: `0 4px 8px var(--shadow-color)`,
          }}
        >
          <GameBoard
            bombCount={parseInt(bombCount)}
            onSafeClick={handleSafeClick}
            onGameOver={handleGameOver}
            isGameStarted={isGameStarted}
          />
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--heading-color)' }}
          >
            Game Status
          </h2>
          <div className="mb-4">
            <label
              className="block mb-2"
              style={{ color: 'var(--label-color)' }}
            >
              Current Winnings:
            </label>
            <p
              className="text-2xl font-bold"
              style={{ color: 'var(--text-color)' }}
            >
              ${currentWinnings.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <label
              className="block mb-2"
              style={{ color: 'var(--label-color)' }}
            >
              Clicks Made:
            </label>
            <p
              className="text-2xl font-bold"
              style={{ color: 'var(--text-color)' }}
            >
              {clickCount}
            </p>
          </div>
          {gameOver && (
            <div className="mb-4">
              <p
                className="text-xl"
                style={{ color: 'var(--text-color)' }}
              >
                Game Over!
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DiamondGame;
