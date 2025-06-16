
import React, { useState, useEffect, useCallback } from 'react';
import { GameCard, GameCardState } from '../types';
import { MEMORY_GAME_EMOJIS } from '../constants';
import Button from './Button';
import { PuzzlePieceIcon } from '@heroicons/react/24/outline';

interface MemoryGameProps {
  onGameEnd: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onGameEnd }) => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = useCallback(() => {
    const gameEmojis = MEMORY_GAME_EMOJIS.slice(0, 6); // Use 6 unique emojis for 12 cards
    const duplicatedEmojis = [...gameEmojis, ...gameEmojis];
    const shuffledEmojis = duplicatedEmojis.sort(() => Math.random() - 0.5);
    setCards(
      shuffledEmojis.map((emoji, index) => ({
        id: index,
        value: emoji,
        state: GameCardState.Hidden,
      }))
    );
    setRevealedCards([]);
    setMoves(0);
    setPairsFound(0);
    setGameWon(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (revealedCards.length === 2) {
      const [firstIndex, secondIndex] = revealedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.value === secondCard.value) {
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, state: GameCardState.Matched }
              : card
          )
        );
        setPairsFound((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex
                ? { ...card, state: GameCardState.Hidden }
                : card
            )
          );
        }, 1000);
      }
      setRevealedCards([]);
      setMoves((prev) => prev + 1);
    }
  }, [revealedCards, cards]);

  useEffect(() => {
    if (pairsFound === MEMORY_GAME_EMOJIS.slice(0,6).length && MEMORY_GAME_EMOJIS.slice(0,6).length > 0) {
      setGameWon(true);
      setTimeout(() => {
         onGameEnd();
      }, 1500); // Auto-close after winning
    }
  }, [pairsFound, onGameEnd]);

  const handleCardClick = (index: number) => {
    if (
      revealedCards.length < 2 &&
      cards[index].state === GameCardState.Hidden
    ) {
      setCards((prevCards) =>
        prevCards.map((card, i) =>
          i === index ? { ...card, state: GameCardState.Revealed } : card
        )
      );
      setRevealedCards((prev) => [...prev, index]);
    }
  };

  if (gameWon) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <h3 className="text-2xl font-semibold text-green-600 mb-2">¡Has Ganado!</h3>
        <p className="text-green-500">¡Buen trabajo distrayéndote!</p>
         <PuzzlePieceIcon className="h-16 w-16 text-green-500 mx-auto my-4"/>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-teal-700 mb-4 text-center">Juego de Memoria</h3>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            disabled={card.state !== GameCardState.Hidden || revealedCards.length === 2}
            className={`aspect-square rounded-md flex items-center justify-center text-2xl sm:text-3xl transition-transform duration-300 transform-style-preserve-3d ${
              card.state !== GameCardState.Hidden ? 'rotate-y-180' : ''
            } ${card.state === GameCardState.Matched ? 'bg-green-300 cursor-default' : 'bg-teal-400 hover:bg-teal-500'}`}
          >
            <div className={`absolute inset-0 flex items-center justify-center backface-hidden ${card.state === GameCardState.Hidden ? '' : 'hidden'}`}>
                <PuzzlePieceIcon className="h-8 w-8 text-white opacity-70"/>
            </div>
            <div className={`absolute inset-0 flex items-center justify-center rotate-y-180 backface-hidden ${card.state !== GameCardState.Hidden ? '' : 'hidden'}`}>
              {card.state !== GameCardState.Hidden ? card.value : ''}
            </div>
          </button>
        ))}
      </div>
      <p className="text-sm text-slate-600 text-center">Movimientos: {moves}</p>
      <Button onClick={onGameEnd} variant="secondary" className="w-full mt-4">Cerrar Juego</Button>
    </div>
  );
};

export default MemoryGame;
    