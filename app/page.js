'use client'
import { useState, useEffect } from "react";
import { getRandomCard } from "../utils/fetchCard";
import { motion } from "framer-motion";
import Card from "../components/card";
import GameControls from "../components/GameControls";
import ScoreBoard from "../components/ScoreBoard";

export default function Home() {
  const [currentCard, setCurrentCard] = useState(null);
  const [previousCard, setPreviousCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewCard, setIsNewCard] = useState(false);
  const [error, setError] = useState(null);
  const [showFront, setShowFront] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [guess, setGuess] = useState(null);
  const [guessResult, setGuessResult] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showGuessResult, setShowGuessResult] = useState(false);
  const [guessResultMessage, setGuessResultMessage] = useState("");

  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
    fetchNewCard();
  }, []);

  // Save high score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('highScore', highScore.toString());
  }, [highScore]);

  async function fetchNewCard() {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching new card...");
      const card = await getRandomCard();
      console.log("Card received:", card);
      
      if (card) {
        if (currentCard) {
          setPreviousCard(currentCard);
        }
        setCurrentCard(card);
        
        if (!previousCard && !gameOver) {
          // First card of the game - show it immediately
          setIsNewCard(true);
          setShowFront(true);
        } else {
          // Subsequent cards or after game over - keep it hidden until player guesses
          setIsNewCard(true);
          setShowFront(false);
        }
      } else {
        setError("Failed to fetch card from API");
      }
    } catch (error) {
      console.error("Error fetching card:", error);
      setError("An error occurred while fetching the card");
    } finally {
      setLoading(false);
    }
  }

  function handleGuess(isHigher) {
    setGuess(isHigher);
    
    // If this is the very first guess, we need to fetch a new card first
    if (!previousCard) {
      fetchNewCard().then(() => {
        // Reveal the card after a short delay
        setTimeout(() => {
          setIsRevealing(true);
          setShowFront(true);
          
          // After card is revealed, evaluate the guess
          setTimeout(() => {
            const result = evaluateGuess(isHigher);
            setGuessResult(result);
            
            if (result) {
              // Correct guess
              const newScore = score + 1;
              setScore(newScore);
              if (newScore > highScore) {
                setHighScore(newScore);
              }
              setGuessResultMessage("Correct! Your streak continues.");
            } else {
              // Incorrect guess - Game over
              setGuessResultMessage("Game Over! Your guess was wrong.");
              setGameOver(true);
            }
            setShowGuessResult(true);
          }, 1000);
        }, 500);
      });
    } else {
      // For subsequent guesses, we already have both cards
      setIsRevealing(true);
      setShowFront(true);
      
      // After card is revealed, evaluate the guess
      setTimeout(() => {
        const result = evaluateGuess(isHigher);
        setGuessResult(result);
        
        if (result) {
          // Correct guess
          const newScore = score + 1;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          setGuessResultMessage("Correct! Your streak continues.");
          
          // Prepare for the next round
          setTimeout(() => {
            // Clear the message before fetching new card
            setGuessResultMessage("");
            setShowGuessResult(false);
            
            setPreviousCard(currentCard);
            setCurrentCard(null);
            setGuess(null);
            setGuessResult(null);
            setIsRevealing(false);
            fetchNewCard();
          }, 1500);
        } else {
          // Incorrect guess - Game over
          setGuessResultMessage("Game Over! Your guess was wrong.");
          setGameOver(true);
          setShowGuessResult(true);
        }
      }, 1000);
    }
  }

  function evaluateGuess(isHigher) {
    if (!previousCard || !currentCard) return null;
    
    const prevValue = previousCard.value;
    const currentValue = currentCard.value;
    
    if (prevValue === currentValue) {
      // If cards are equal, player gets the benefit of the doubt
      return true;
    }
    
    return isHigher ? currentValue > prevValue : currentValue < prevValue;
  }

  function restartGame() {
    setPreviousCard(null);
    setCurrentCard(null);
    setScore(0);
    setGameOver(false);
    setGuess(null);
    setGuessResult(null);
    setIsRevealing(false);
    setShowGuessResult(false);
    setGuessResultMessage(""); // Clear the message
    fetchNewCard();
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 font-mono relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #1a1a1a, #0d0d0d)',
      }}
    >
      {/* Animated Background patterns inspired by Squid Game */}
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
        <motion.div 
          className="absolute w-20 h-20 rounded-full border-4 border-[#ff0087]"
          initial={{ top: "20%", left: "10%" }}
          animate={{ 
            top: ["20%", "22%", "19%", "21%", "20%"],
            left: ["10%", "12%", "11%", "9%", "10%"],
            rotate: [0, 10, -5, 15, 0],
            scale: [1, 1.05, 0.98, 1.02, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "mirror"
          }}
        />
        {/* Add more animated shapes here as desired */}
      </div>
      
      {/* Game title with Squid Game style */}
      <motion.div
        className="mb-24 text-center relative z-10"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h1 className="text-6xl font-bold text-[#ff0087] tracking-wider">
          CARD GAME
        </h1>
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center space-x-4">
          <motion.div 
            className="w-10 h-10 bg-[#42c2dc] rounded-full"
            animate={{ scale: [1, 1.1, 1, 0.95, 1] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
          />
          <motion.div 
            className="w-10 h-10 bg-[#ff0087] rounded"
            animate={{ scale: [1, 0.95, 1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
          />
          <motion.div 
            className="w-10 h-10 bg-[#42c2dc]"
            style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}
            animate={{ scale: [1, 1.05, 0.95, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 1 }}
          />
        </div>
      </motion.div>
      
      <ScoreBoard 
        score={score} 
        highScore={highScore} 
        gameOver={gameOver} 
      />
      
      {error && (
        <div className="bg-[#ff0087] text-white p-4 rounded-md mb-4 border-2 border-white z-10">
          {error}
        </div>
      )}
      
      <div className="flex justify-center items-center space-x-6 mb-8">
        {previousCard && (
          <Card 
            card={previousCard}
            isNew={false}
            showFront={true}
          />
        )}
        
        {currentCard && (
          <Card 
            card={currentCard}
            isNew={isNewCard}
            showFront={showFront || isRevealing}
            isRevealing={isRevealing}
            guessResult={guessResult}
          />
        )}
        
        {!currentCard && loading && (
          <div className="w-64 h-96 rounded-xl bg-[#1a1a1a] flex items-center justify-center border-4 border-[#ff0087] z-10">
            <div className="flex flex-col items-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-t-4 border-[#42c2dc] rounded-full mb-4"
              ></motion.div>
              <p className="text-xl font-bold text-[#42c2dc]">Loading...</p>
            </div>
          </div>
        )}
      </div>
      
      {showGuessResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`text-xl font-bold mb-6 ${guessResult ? 'text-[#42c2dc]' : 'text-[#ff0087]'}`}
        >
          {guessResultMessage}
        </motion.div>
      )}

      <GameControls
        onHigher={() => handleGuess(true)}
        onLower={() => handleGuess(false)}
        onRestart={restartGame}
        gameOver={gameOver}
        loading={loading || isRevealing}
        showButtons={previousCard !== null}
        guess={guess}
      />

      {/* Game instructions when no previous card is shown */}
      {!previousCard && !gameOver && (
        <motion.div 
          className="text-white text-center mt-4 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xl mb-2">Will the next card be higher or lower?</p>
          <p className="opacity-70">Make your first guess to start the game!</p>
        </motion.div>
      )}
      
      {/* Game over message */}
      {gameOver && (
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="bg-[#1a1a1a] border-4 border-[#ff0087] p-8 rounded-lg text-center"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h2 className="text-4xl font-bold text-[#ff0087] mb-4">GAME OVER</h2>
            <p className="text-xl text-white mb-6">Your score: {score}</p>
            <motion.button
              className="px-8 py-4 bg-[#42c2dc] hover:bg-[#35a3b9] text-white rounded-none border-2 border-white shadow-lg text-lg font-bold tracking-wider"
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(66, 194, 220, 0.7)' }}
              whileTap={{ scale: 0.95 }}
              onClick={restartGame}
            >
              PLAY AGAIN
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Pink light effect */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#ff0087] via-[#ff008730] to-transparent z-0"
        animate={{ 
          opacity: [0.7, 0.9, 0.7, 0.8, 0.7],
          height: ["64vh", "65vh", "62vh", "66vh", "64vh"]
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
      />
      
      {/* Teal light effect from top */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#42c2dc20] to-transparent z-0"
        animate={{ 
          opacity: [0.3, 0.5, 0.3, 0.4, 0.3],
          height: ["40vh", "38vh", "42vh", "39vh", "40vh"]
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", delay: 1 }}
      />
    </motion.div>
  );
}