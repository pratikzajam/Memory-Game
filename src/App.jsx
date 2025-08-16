import React, { useState, useEffect } from "react";

const emojis = ["🍎", "🍌", "🍇", "🍊", "🍒", "🍓", "🥝", "🍍"];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");

  useEffect(() => {
    startGame(difficulty);
  }, [difficulty]);

  useEffect(() => {
    let timer;
    if (!gameOver) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameOver]);

  const startGame = (level) => {
    let pairs = level === "easy" ? 6 : level === "medium" ? 8 : 12;
    const newCards = shuffleArray([...emojis.slice(0, pairs), ...emojis.slice(0, pairs)]);
    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setGameOver(false);
  };

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setGameOver(true);
    }
  }, [matched, cards]);

  const shareScore = () => {
    const scoreMessage = `🎉 I just won the Memory Game on ${difficulty.toUpperCase()} mode in ${moves} moves and ${time}s! 🌀⏱
Play now and beat my score! 🔗`;

    // Try Web Share API first (mobile friendly)
    if (navigator.share) {
      navigator
        .share({
          title: "Memory Game Score",
          text: scoreMessage,
          url: window.location.href,
        })
        .catch((err) => console.log("Share cancelled", err));
    } else {
      // Fallback: open Twitter
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(scoreMessage)}&url=${encodeURIComponent(window.location.href)}`;
      window.open(tweetUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-pink-500 p-4">
      <h1 className="text-4xl font-bold text-white mb-4">🎴 Memory Game</h1>

      {/* Controls */}
      <div className="flex gap-4 mb-6 text-white">
        <span>⏱ Time: {time}s</span>
        <span>🌀 Moves: {moves}</span>
        <button
          onClick={() => startGame(difficulty)}
          className="bg-white text-black px-3 py-1 rounded-lg shadow-md hover:bg-gray-200"
        >
          Restart
        </button>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-white text-black px-2 py-1 rounded-lg"
        >
          <option value="easy">Easy (3x4)</option>
          <option value="medium">Medium (4x4)</option>
          <option value="hard">Hard (6x6)</option>
        </select>
      </div>

      {/* Game Board */}
      <div
        className={`grid gap-3 ${
          difficulty === "easy"
            ? "grid-cols-3"
            : difficulty === "medium"
            ? "grid-cols-4"
            : "grid-cols-6"
        }`}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <div
              key={index}
              onClick={() => handleFlip(index)}
              className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-3xl 
                rounded-xl shadow-lg cursor-pointer transition-transform duration-300 
                ${isFlipped ? "bg-white text-black" : "bg-gray-900 text-transparent hover:scale-105"}`}
            >
              {isFlipped ? card : "❓"}
            </div>
          );
        })}
      </div>

      {/* Win Message */}
      {gameOver && (
        <div className="mt-6 bg-white text-black p-4 rounded-xl shadow-lg text-center">
          🎉 You Won in {moves} moves & {time}s!
          <div className="mt-3 flex gap-3 justify-center">
            <button
              onClick={() => startGame(difficulty)}
              className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
            >
              Play Again
            </button>
            <button
              onClick={shareScore}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
            >
              Share 📨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
