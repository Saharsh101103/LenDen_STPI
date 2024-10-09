"use client";
import { useState, useEffect } from "react";

type CircleState = "hidden" | "gem" | "Bomb";

interface GameBoardProps {
    bombCount: number;
    onSafeClick: (clickCount: number) => void;
    onGameOver: (isHomeRun: boolean) => void;
    isGameStarted: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
    bombCount,
    onSafeClick,
    onGameOver,
    isGameStarted,
}) => {
    const [gameState, setGameState] = useState<CircleState[]>(Array(24).fill("hidden"));
    const [bombPositions, setBombPositions] = useState<Set<number>>(new Set());
    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        if (isGameStarted) {
            initializeGame();
        }
    }, [isGameStarted, bombCount]);

    const initializeGame = () => {
        const newGameState = Array(24).fill("hidden");
        const newBombPositions = new Set<number>();
        while (newBombPositions.size < bombCount) {
            newBombPositions.add(Math.floor(Math.random() * 24));
        }
        setGameState(newGameState);
        setBombPositions(newBombPositions);
        setClickCount(0);
    };

    const handleCircleClick = (index: number) => {
        if (gameState[index] !== "hidden" || !isGameStarted) return;

        const newGameState = [...gameState];
        if (bombPositions.has(index)) {
            newGameState[index] = "Bomb";
            setGameState(newGameState);
            onGameOver(false);
        } else {
            newGameState[index] = "gem";
            setGameState(newGameState);
            const newClickCount = clickCount + 1;
            setClickCount(newClickCount);
            onSafeClick(newClickCount);

            if (newClickCount === 24 - bombCount) {
                onGameOver(true);
            }
        }
    };

    useEffect(() => {
        if (!isGameStarted) {
            const finalGameState = [...gameState];
            bombPositions.forEach((pos) => {
                finalGameState[pos] = "Bomb";
            });
            setGameState(finalGameState);
        }
    }, [isGameStarted, bombPositions]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                 className="grid grid-cols-4 sm:grid-cols-6 gap-4 bg-gray-200 p-4 rounded-lg items-center justify-center"
            >
                {gameState.map((state, index) => (
                <div
                    key={index}
                    className={`aspect-square rounded-full cursor-pointer
                                w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
                                flex items-center justify-center mx-auto my-auto
                                ${
                                    state === "hidden"
                                        ? "bg-white border-2 border-gray-300"
                                        : state === "gem"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                }`}
                    onClick={() => handleCircleClick(index)}
                />
            ))}
        </div>
    </div>
    );
};

export default GameBoard;