'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Diamond, Bomb } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import { Loader } from '@/components/Loading'

type CellContent = 'empty' | 'diamond' | 'mine'
type CellState = 'hidden' | 'revealed'

interface Cell {
  content: CellContent
  state: CellState
}

const GRID_SIZE = 5

export default function DiamondMiner() {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameState, setGameState] = useState<"betting" | "playing" | "ended">("betting")
  const [credits, setCredits] = useState(0)
  const [bet, setBet] = useState(0)
  const [earnings, setEarnings] = useState(0)
  const [cashoutAvailable, setCashoutAvailable] = useState(false)
  const [message, setMessage] = useState("")
  const [mineCount, setMineCount] = useState(1)
  const [cashoutUsed, setCashoutUsed] = useState(false)
  const [mainGrid, setMainGrid] = useState<Cell[][]>([])
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the grid and setup the game
  const initializeGrid = () => {
    const newGrid: Cell[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => ({ content: 'diamond', state: 'hidden' }))
      )


      const placeMine = (item: CellContent, count: number) => {
        let minesPlaced = 0;
        while (minesPlaced < count) {
          const x = Math.floor(Math.random() * GRID_SIZE);
          const y = Math.floor(Math.random() * GRID_SIZE);
          if (newGrid[y][x].content === 'diamond') {
            newGrid[y][x].content = item;
            minesPlaced++;
          }
        }
      };

    placeMine('mine', mineCount) // Add mines

    setGrid(newGrid);
  
    const revealMinesInGrid = (newGrid: Cell[][]) => {
      // Create a new grid to avoid mutating the original state directly
      const originalGrid: Cell[][] = newGrid.map(row =>
        row.map(cell => ({ ...cell })) // Create a shallow copy of each cell
      );
  
      // Loop through the grid to reveal mines
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (originalGrid[i][j].content === 'mine') {
            originalGrid[i][j].state = 'revealed';
          }
        }
      }
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          getCellContent(originalGrid[i][j]); // Pass each cell to getCellContent
        }
      }
  
      setMainGrid(originalGrid);
    };
  

    revealMinesInGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setEarnings(0);
    setCashoutAvailable(false);
    setCashoutUsed(false);
    setGameState("playing");
  };

  // When game is initialized or bet is placed, reset the game
  useEffect(() => {
    if (gameState === "playing") initializeGrid()
  }, [gameState])

  // Handle the user clicking on a cell
  const handleCellClick = (row: number, col: number) => {
    if (gameOver || grid[row][col].state === 'revealed') return

    const newGrid = [...grid]
    newGrid[row][col].state = 'revealed'
    mainGrid[row][col].state = 'revealed'

    if (newGrid[row][col].content === 'diamond') {
      setScore(prevScore => prevScore + 1)
      setEarnings(prevEarnings => prevEarnings + bet * 0.2) // 50% increase per diamond
      setCashoutAvailable(true)
      setGrid(newGrid)
    } else if (newGrid[row][col].content === 'mine') {
      setGameOver(true)
      setGrid(mainGrid)
      setGameState('ended')
    }
  }

  // Cash out the winnings
  const handleCashout = () => {
    if (cashoutAvailable) {
      setCredits(prevCredits => prevCredits + earnings)
      setGameOver(true)
      setGameState('ended')
      setCashoutUsed(true)
    }
  }

  // Determine what to display in each cell based on its state and content
  const getCellContent = (cell: Cell) => {
    if (cell.state === 'hidden') {
      return <div className="w-full h-full bg-gray-300 rounded-md"></div>
    } else if (cell.content === 'diamond') {
      return <Diamond className="w-full h-full text-blue-500" />
    } else if (cell.content === 'mine') {
      return <Bomb className="w-full h-full text-red-500" />
    }
    return <div className="w-full h-full bg-gray-100 rounded-md"></div>
  }

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

  if (isLoading) {
    return (
      <div className='h-screen w-full flex justify-center items-center'>
        <Loader isLoading={isLoading} />
      </div> 
    )
  }

  return (
    <div className='flex flex-col min-h-screen justify-center items-center'>
      <nav>
        <Sidebar
          isstepsLimit={false}
          ismineCount={true}
          game="DiamondMiner"
          gameState={gameState}
          setGameState={setGameState}
          bettingAmount={bet}
          setBettingAmount={setBet}
          message={message}
          setMessage={setMessage}
          mines={mineCount}
          initializeGame={initializeGrid}
          newCash={credits}
          setMineCount={setMineCount}
        />
      </nav>
      <h1 className="text-3xl font-bold mb-4">Diamond Miner</h1>

      {gameState !== "betting" && (
        <div className="mb-4">Current Bet: {bet}</div>
      )}
      {gameState !== "betting" && <div className="mb-4">Score: {score}</div>}

      <Card             style={{
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
            }} className="w-full max-w-md mx-auto background-color text-color">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Find the Diamonds!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 mb-4">
            <AnimatePresence>
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className="w-full pt-[100%] relative focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md overflow-hidden"
                    disabled={gameOver || cell.state === 'revealed' || gameState !== "playing"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getCellContent(cell)}
                    </div>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>

          {gameOver && (
            <div className="text-center space-y-2">
              <p className="text-red-500 font-bold mt-2">Game Over!</p>
              <p className="text-lg font-semibold">
                {!cashoutUsed ? `You lost your bet of ${bet.toFixed(2)} Credits` : `You won ${earnings.toFixed(2)} Credits`}
              </p>
            </div>
          )}
        </CardContent>
        {gameState === 'playing' && !gameOver && (
          <CardFooter className="space-x-4">
            <Button onClick={handleCashout} className="w-full" disabled={!cashoutAvailable}>
              Cashout
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
