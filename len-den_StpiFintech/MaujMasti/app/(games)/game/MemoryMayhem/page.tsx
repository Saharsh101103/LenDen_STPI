'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import GamingSidebar from '@/components/Sidebar'
import { Provider } from 'react-redux';
import Sidebar from '@/components/Sidebar'

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']

interface CardType {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean  
}

export default function MemoryGameWithBetting() {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [credits, setCredits] = useState(1000)
  const [bet, setBet] = useState(10)
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting')

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Shuffle and set up the cards
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setGameState('betting')
  }

  const startGame = () => {
    if (bet > credits) {
      alert("You don't have enough credits for this bet!")
      return
    }
    setCredits(credits - bet)
    setGameState('playing')
  }

  const handleCardClick = (id: number) => {
    if (gameState !== 'playing' || flippedCards.length === 2){
      console.log(gameState)
      return
    } 
      

    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    )
    setCards(updatedCards)
    setFlippedCards([...flippedCards, id])

    if (flippedCards.length === 1) {
      setMoves(moves + 1)
      const [firstCardId] = flippedCards
      const firstCard = cards.find(card => card.id === firstCardId)
      const secondCard = updatedCards.find(card => card.id === id)

      if (firstCard?.emoji === secondCard?.emoji) {
        setCards(updatedCards.map(card =>
          card.id === firstCardId || card.id === id ? { ...card, isMatched: true } : card
        ))
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setCards(updatedCards.map(card =>
            card.id === firstCardId || card.id === id ? { ...card, isFlipped: false } : card
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const allMatched = cards.every(card => card.isMatched)

  useEffect(() => {
    if (allMatched && gameState === 'playing') {
      const baseWinnings = bet * 2
      const movesBonus = Math.max(0, 100 - moves * 5)
      const totalWinnings = baseWinnings + movesBonus
      setCredits(credits => credits + totalWinnings)
      setGameState('ended')
    }
  }, [allMatched, bet, moves, gameState])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <nav>
      <Sidebar isstepsLimit={true} ismineCount={false} game='MemoryMayhem' gameState='betting' setGameState={setGameState}/>
      </nav>
        <h1 className="text-3xl font-bold mb-4">Memory Mayhem</h1>



        {gameState !== 'betting' && <div className="mb-4">Current Bet: {bet}</div>}
        {gameState !== 'betting' && <div className="mb-4">Moves: {moves}</div>}

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {cards.map(card => (
            <Card
              key={card.id}
              className={`w-16 h-16 flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${card.isFlipped || card.isMatched ? 'bg-white' : 'bg-blue-500'}`}
              style={{ backgroundColor: card.isFlipped || card.isMatched ? 'var(--card-flipped-bg-color)' : 'var(--card-bg-color)', borderRadius: 'var(--border-radius)' }}
              onClick={() => !card.isFlipped && !card.isMatched && handleCardClick(card.id)}
            >
              {card.isFlipped || card.isMatched ? card.emoji : ''}
            </Card>
          ))}
        </div>

        {/* End Game Section */}
        {gameState === 'ended' && (
          <div className="text-xl font-bold mb-4">
            Congratulations! You won in {moves} moves!
            <br />
            Winnings: {bet * 2 + Math.max(0, 100 - moves * 5)} credits
          </div>
        )}
      </div>
  )
}
