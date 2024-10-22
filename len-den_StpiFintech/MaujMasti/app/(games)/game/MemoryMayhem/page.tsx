"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { Loader } from "@/components/Loading";

const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGameWithBetting() {
    const [cards, setCards] = useState<CardType[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [credits, setCredits] = useState(0);
    const [bet, setBet] = useState(0);
    const [maxSteps, setMaxSteps] = useState(16);
    const [gameState, setGameState] = useState<"betting" | "playing" | "ended">("betting");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        initializeGame();
    }, []);
    

    const initializeGame = () => {
        const shuffledCards = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(shuffledCards);
        setFlippedCards([]);
        setMoves(0);
        setGameState("betting");
        console.log("State set to betting");
    };

    const handleCardClick = (id: number) => {
        if (gameState !== "playing" || flippedCards.length === 2) return;

        const updatedCards = cards.map((card) =>
            card.id === id ? { ...card, isFlipped: true } : card
        );
        setCards(updatedCards);
        setFlippedCards((prev) => [...prev, id]);

        if (flippedCards.length === 1) {
            setMoves((prevMoves) => prevMoves + 1);
            const [firstCardId] = flippedCards;
            const firstCard = cards.find((card) => card.id === firstCardId);
            const secondCard = updatedCards.find((card) => card.id === id);

            if (firstCard?.emoji === secondCard?.emoji) {
                setCards(updatedCards.map((card) =>
                    card.id === firstCardId || card.id === id
                        ? { ...card, isMatched: true }
                        : card
                ));
                setFlippedCards([]);
            } else {
                setTimeout(() => {
                    setCards(updatedCards.map((card) =>
                        card.id === firstCardId || card.id === id
                            ? { ...card, isFlipped: false }
                            : card
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

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

    const allMatched = cards.every((card) => card.isMatched);

    useEffect(() => {
        if ((allMatched && gameState === "playing") || moves === maxSteps) {
            if (allMatched) {
                setCredits(bet * 2);
            }
            else{
              setCredits(-bet)
            }
            setGameState("ended");
        }
    }, [allMatched, bet, moves, gameState]);

    if (isLoading) {
      return (
        <div className='h-screen w-full flex justify-center items-center'>
          <Loader isLoading={isLoading} />
        </div> 
      )
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen"
            style={{
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
            }}
        >
            <nav>
                <Sidebar
            isstepsLimit={true}
            ismineCount={false}
            game="MemoryMayhem"
            gameState={gameState}
            setGameState={setGameState}
            bettingAmount={bet}
            setBettingAmount={setBet}
            message={message}
            setMessage={setMessage}
            stepsLimit={maxSteps}
            setStepsLimit={setMaxSteps}
            initializeGame={initializeGame} newCash={credits}                />
            </nav>
            <h1 className="text-3xl font-bold mb-4">Memory Mayhem</h1>

            {gameState !== "betting" && (
                <div className="mb-4">Current Bet: {bet}</div>
            )}
            {gameState !== "betting" && <div className="mb-4">Moves: {moves}</div>}

            <div className="grid grid-cols-4 gap-4 mb-4">
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        className={`w-16 h-16 flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${card.isFlipped || card.isMatched ? "bg-white" : "bg-blue-500"}`}
                        style={{
                            backgroundColor:
                                card.isFlipped || card.isMatched
                                    ? "#000000"
                                    : "#FFFFFF",
                            borderRadius: "var(--border-radius)",
                        }}
                        onClick={() => 
                            !card.isFlipped && !card.isMatched && handleCardClick(card.id)
                        }
                    >
                        {card.isFlipped || card.isMatched ? card.emoji : ""}
                    </Card>
                ))}
            </div>

            <div className="mt-4">
                {gameState && (
            <div className="text-center space-y-2">
              <p className="text-red-500 font-bold mt-2">Game Over!</p>
              <p className="text-lg font-semibold">
                {!allMatched ? `You lost your bet of ${bet.toFixed(2)} Credits` : `You won ${credits.toFixed(2)} Credits`}
              </p>
            </div>
          )}
            </div>
        </div>
    );
}
