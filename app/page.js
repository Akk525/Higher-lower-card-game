'use client'
import { useState, useEffect } from "react";
import { getRandomCard } from "../utils/fetchCard";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/Card";
import GameControls from "../components/GameControls";
import ScoreBoard from "../components/ScoreBoard";

export default function Home() {
  // Add a new state to control whether to show landing page or game
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [titleAnimation, setTitleAnimation] = useState(false);
  
  // Existing states
  const [currentCard, setCurrentCard] = useState(null);
  const [previousCard, setPreviousCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewCard, setIsNewCard] = useState(false);
  const [error, setError] = useState(null);
  const [showFront, setShowFront] = useState(false); // Start with face-down cards
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [guess, setGuess] = useState(null);
  const [guessResult, setGuessResult] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showGuessResult, setShowGuessResult] = useState(false);
  const [guessResultMessage, setGuessResultMessage] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Function to handle the start game button click
  const handleStartGame = () => {
    setTitleAnimation(true);
    
    // After title animation completes, show the game
    setTimeout(() => {
      setShowLandingPage(false);
      
      // After landing page transitions out, initialize the game
      setTimeout(() => {
        // Check if user has visited before using localStorage
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
        
        // If this is their first time, show instructions automatically
        if (!hasVisitedBefore) {
          setShowInstructions(true);
          localStorage.setItem('hasVisitedBefore', 'true');
        }
        
        // Load high score from localStorage
        const savedHighScore = localStorage.getItem('highScore');
        if (savedHighScore) {
          setHighScore(parseInt(savedHighScore, 10));
        }
        
        // Start fetching the first card
        fetchNewCard();
      }, 500);
    }, 3000); // Wait for 3 seconds for the title animation
  };

  // Your existing useEffect hooks - just keep the localStorage ones
  useEffect(() => {
    localStorage.setItem('highScore', highScore.toString());
  }, [highScore]);

  useEffect(() => {
    if (currentCard && !previousCard) {
      setShowFront(true);
    }
  }, [currentCard, previousCard]);

  // Rest of your existing functions (fetchNewCard, handleGuess, etc.)
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
        setIsNewCard(true);
        
        // FIRST CARD LOGIC: Only first card is face up
        if (!previousCard && !currentCard) {
          // First card of the game - show immediately
          setShowFront(true);
        } else {
          // All subsequent cards - keep face down until guessed
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
    setIsRevealing(true); // Start the reveal process
    
    // If this is the very first guess, we need to fetch a new card first
    if (!previousCard) {
      fetchNewCard().then(() => {
        // Flip the card after a short delay
        setTimeout(() => {
          setShowFront(true); // Show the card face
          
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
              setShowGuessResult(true);
            } else {
              // Incorrect guess - Game over
              setGuessResultMessage("Game Over! Your guess was wrong.");
              setGameOver(true);
              setShowGuessResult(true);
            }
          }, 1000);
        }, 500);
      });
    } else {
      // For subsequent guesses, flip the card to reveal it
      setTimeout(() => {
        setShowFront(true); // Flip the card to show the face
        
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
            setShowGuessResult(true);
            
            // Prepare for the next round
            setTimeout(() => {
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
      }, 500);
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
    <AnimatePresence mode="wait">
      {showLandingPage ? (
        // Landing Page
        <motion.div 
          key="landing"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center min-h-screen p-4 font-mono relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(to bottom, #1a1a1a, #0d0d0d)',
          }}
        >
          {/* Background patterns */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#ff0087] via-[#ff008730] to-transparent z-0"
            animate={{ 
              opacity: [0.7, 0.9, 0.7, 0.8, 0.7],
              height: ["40vh", "42vh", "38vh", "43vh", "40vh"]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
          />
          
          <motion.div 
            className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#42c2dc20] to-transparent z-0"
            animate={{ 
              opacity: [0.3, 0.5, 0.3, 0.4, 0.3],
              height: ["30vh", "28vh", "32vh", "29vh", "30vh"]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", delay: 1 }}
          />
          
          {/* Squid Game Shapes */}
          <motion.div 
            className="relative z-10 mb-8 flex flex-col items-center"
            initial={{ opacity: 1 }}
            animate={titleAnimation ? { y: -50 } : {}}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center space-x-6">
              <motion.div 
                className="w-16 h-16 bg-[#42c2dc] rounded-full"
                animate={titleAnimation ? { 
                  scale: [1, 1.2, 0.8, 1],
                  y: [0, -20, 0],
                  opacity: [1, 0.8, 1] 
                } : {
                  scale: [1, 1.05, 0.95, 1], 
                }}
                transition={{ duration: 2, repeat: titleAnimation ? 0 : Infinity, repeatType: "mirror" }}
              />
              <motion.div 
                className="w-16 h-16 bg-[#ff0087]"
                animate={titleAnimation ? { 
                  scale: [1, 1.2, 0.8, 1],
                  y: [0, -20, 0],
                  opacity: [1, 0.8, 1]
                } : {
                  scale: [0.95, 1, 1.05, 0.95], 
                }}
                transition={{ duration: 2, delay: 0.3, repeat: titleAnimation ? 0 : Infinity, repeatType: "mirror" }}
              />
              <motion.div 
                className="w-16 h-16"
                style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', background: '#42c2dc'}}
                animate={titleAnimation ? { 
                  scale: [1, 1.2, 0.8, 1],
                  y: [0, -20, 0],
                  opacity: [1, 0.8, 1]
                } : {
                  scale: [1, 0.95, 1.05, 1], 
                }}
                transition={{ duration: 2, delay: 0.6, repeat: titleAnimation ? 0 : Infinity, repeatType: "mirror" }}
              />
            </div>
            
            {/* Title that appears during animation */}
            <AnimatePresence>
              {titleAnimation && (
                <motion.div 
                  className="absolute top-24"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-[#ff0087] tracking-widest">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.3 }}
                    >C</motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.3 }}
                    >A</motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.3 }}
                    >R</motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.3 }}
                    >D</motion.span>
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      transition={{ delay: 1.6, duration: 0.3 }}
                      className="inline-block"
                    > </motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7, duration: 0.3 }}
                    >G</motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8, duration: 0.3 }}
                    >A</motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.9, duration: 0.3 }}
                    >M</motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2, duration: 0.3 }}
                    >E</motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.1, duration: 0.3 }}
                    >S</motion.span>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Play button */}
          <motion.button
            className="relative z-10 px-8 py-4 mt-16 bg-[#ff0087] text-white text-2xl font-bold tracking-wider border-2 border-white shadow-lg hover:bg-[#d10070] transition-colors"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 0, 135, 0.7)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
            animate={titleAnimation ? { opacity: 0, y: 30 } : {}}
            transition={{ duration: 0.5 }}
          >
            PLAY IF YOU DARE
          </motion.button>
          
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Include your existing floating shapes here */}
            <motion.div 
              className="absolute w-12 h-12 rounded-full bg-[#42c2dc] opacity-20"
              style={{ top: '15%', left: '10%' }}
              animate={{ 
                y: [0, -40, 0, 20, 0],
                x: [0, 20, 40, 20, 0],
                opacity: [0.2, 0.3, 0.2, 0.1, 0.2]
              }}
              transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div 
              className="absolute w-8 h-8 rounded-full bg-[#ff0087] opacity-15"
              style={{ top: '65%', left: '75%' }}
              animate={{ 
                y: [0, 30, 0, -20, 0],
                x: [0, -20, -40, -20, 0],
                opacity: [0.15, 0.25, 0.15, 0.1, 0.15]
              }}
              transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", delay: 2 }}
            />
          </div>
        </motion.div>
      ) : (
        // Game Page (your existing game UI)
        <motion.div 
          key="game"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-between min-h-screen p-2 font-mono relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(to bottom, #1a1a1a, #0d0d0d)',
          }}
        >
          {/* Your existing game code */}
          {/* Background patterns */}
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
            {/* Background patterns */}
          </div>
          
          {/* Your Squid Game Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Copy all your existing shapes here */}
            <motion.div 
              className="absolute w-12 h-12 rounded-full bg-[#42c2dc] opacity-20"
              style={{ top: '15%', left: '10%' }}
              animate={{ 
                y: [0, -40, 0, 20, 0],
                x: [0, 20, 40, 20, 0],
                opacity: [0.2, 0.3, 0.2, 0.1, 0.2]
              }}
              transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div 
              className="absolute w-8 h-8 rounded-full bg-[#ff0087] opacity-15"
              style={{ top: '65%', left: '75%' }}
              animate={{ 
                y: [0, 30, 0, -20, 0],
                x: [0, -20, -40, -20, 0],
                opacity: [0.15, 0.25, 0.15, 0.1, 0.15]
              }}
              transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", delay: 2 }}
            />
            
            {/* Squares */}
            <motion.div 
              className="absolute w-14 h-14 bg-[#ff0087] opacity-20"
              style={{ top: '30%', left: '80%' }}
              animate={{ 
                rotate: [0, 45, 90, 45, 0],
                y: [0, -30, 0, 30, 0],
                x: [0, -20, -40, -20, 0],
                opacity: [0.2, 0.3, 0.2, 0.1, 0.2]
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", delay: 1 }}
            />
            <motion.div 
              className="absolute w-10 h-10 bg-[#42c2dc] opacity-15"
              style={{ top: '70%', left: '20%' }}
              animate={{ 
                rotate: [0, -45, -90, -45, 0],
                y: [0, 40, 0, -40, 0],
                x: [0, 30, 60, 30, 0],
                opacity: [0.15, 0.25, 0.15, 0.1, 0.15]
              }}
              transition={{ duration: 17, repeat: Infinity, repeatType: "mirror", delay: 3 }}
            />
            
            {/* Triangles */}
            <motion.div 
              className="absolute w-16 h-16 opacity-20"
              style={{ 
                top: '20%', 
                left: '40%',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                background: '#42c2dc'
              }}
              animate={{ 
                rotate: [0, 20, 0, -20, 0],
                y: [0, 50, 100, 50, 0],
                x: [0, 30, 0, -30, 0],
                opacity: [0.2, 0.1, 0.2, 0.3, 0.2]
              }}
              transition={{ duration: 23, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
            />
            <motion.div 
              className="absolute w-10 h-10 opacity-15"
              style={{ 
                top: '80%', 
                left: '60%',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                background: '#ff0087'
              }}
              animate={{ 
                rotate: [0, -30, 0, 30, 0],
                y: [0, -40, -80, -40, 0],
                x: [0, -20, 0, 20, 0],
                opacity: [0.15, 0.1, 0.15, 0.25, 0.15]
              }}
              transition={{ duration: 19, repeat: Infinity, repeatType: "mirror", delay: 2.5 }}
            />
          </div>

          {/* Rest of your game UI */}
          <div className="w-full pt-2 pb-0 relative z-10">
            {/* Game title */}
            <motion.div
              className="mb-10 text-center relative"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[#ff0087] tracking-wider">
                CARD GAMES
              </h1>
              <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-3">
                <motion.div 
                  className="w-8 h-8 bg-[#42c2dc] rounded-full"
                  animate={{ scale: [1, 1.1, 1, 0.95, 1] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
                />
                <motion.div 
                  className="w-8 h-8 bg-[#ff0087] rounded"
                  animate={{ scale: [1, 0.95, 1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
                />
                <motion.div 
                  className="w-8 h-8 bg-[#42c2dc]"
                  style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}
                  animate={{ scale: [1, 1.05, 0.95, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 1 }}
                />
              </div>
            </motion.div>

            {/* The rest of your existing game UI - info button, scoreboard, etc */}
            <motion.button
              className="absolute top-1 right-2 bg-[#1a1a1a] border-2 border-[#42c2dc] rounded-full p-1 z-20"
              whileHover={{ scale: 1.1, boxShadow: '0 0 10px rgba(66, 194, 220, 0.5)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowInstructions(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#42c2dc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </motion.button>
            
            <ScoreBoard 
              score={score} 
              highScore={highScore} 
              gameOver={gameOver} 
            />
            
            {error && (
              <div className="bg-[#ff0087] text-white p-2 text-sm rounded-md mx-auto max-w-xs border-2 border-white z-10">
                {error}
              </div>
            )}
          </div>
          
          {/* Cards Section */}
          <div className="flex flex-col items-center justify-center flex-1 py-2">
            <div className="flex justify-center items-center space-x-3 sm:space-x-4 md:space-x-6 mb-4">
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
                  showFront={(!previousCard && currentCard) || isRevealing ? showFront : false}
                  isRevealing={isRevealing}
                  guessResult={guessResult}
                />
              )}
              
              {!currentCard && loading && (
                <div className="w-48 h-72 sm:w-56 sm:h-80 md:w-64 md:h-96 rounded-xl bg-[#1a1a1a] flex items-center justify-center border-4 border-[#ff0087] z-10">
                  <div className="flex flex-col items-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-12 h-12 border-t-4 border-[#42c2dc] rounded-full mb-3"
                    ></motion.div>
                    <p className="text-xl font-bold text-[#42c2dc]">Loading...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Your existing message components */}
            {showGuessResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-lg font-bold mb-3 ${guessResult ? 'text-[#42c2dc]' : 'text-[#ff0087]'}`}
              >
                {guessResultMessage}
              </motion.div>
            )}

            {!previousCard && !gameOver && (
              <motion.div 
                className="text-white text-center mt-2 max-w-md px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-lg mb-1">Will the next card be higher or lower?</p>
                <p className="text-sm opacity-70">Make your first guess to start the game!</p>
              </motion.div>
            )}
          </div>
          
          {/* Game controls */}
          <div className="w-full pb-4 z-10">
            <GameControls
              onHigher={() => handleGuess(true)}
              onLower={() => handleGuess(false)}
              onRestart={restartGame}
              gameOver={gameOver}
              loading={loading || isRevealing}
              showButtons={true}
              guess={guess}
            />
          </div>

          {/* Your existing modals */}
          {showInstructions && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-[#1a1a1a] border-4 border-[#42c2dc] p-8 rounded-lg max-w-md w-full mx-4"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-[#42c2dc]">How to Play</h2>
                  <motion.button
                    className="text-white bg-[#ff0087] rounded-full p-2"
                    whileHover={{ scale: 1.1, backgroundColor: "#d10070" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInstructions(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </motion.button>
                </div>
                
                <div className="text-white space-y-4">
                  <div className="flex items-start space-x-2">
                    <div className="bg-[#ff0087] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                    <p>You&apos;ll see one card facing up. This is your reference card.</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="bg-[#ff0087] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                    <p>Guess if the next card will be higher or lower in value than the current card.</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="bg-[#ff0087] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                    <p>After you guess, the next card will flip over to reveal if you were right!</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="bg-[#ff0087] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                    <p>If your guess is correct, your score increases and you continue playing.</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="bg-[#ff0087] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">5</div>
                    <p>If your guess is wrong, the game is over!</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <h3 className="text-xl font-bold text-[#42c2dc] mb-2">Card Values</h3>
                    <p>2 is the lowest card, followed by 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, and Ace (highest).</p>
                  </div>
                </div>
                
                <motion.button
                  className="w-full mt-6 px-6 py-3 bg-[#42c2dc] hover:bg-[#35a3b9] text-white rounded-none border-2 border-white shadow-lg text-lg font-bold tracking-wider"
                  whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(66, 194, 220, 0.7)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowInstructions(false)}
                >
                  GOT IT!
                </motion.button>
              </motion.div>
            </motion.div>
          )}
          
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

          {/* Background effects */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#ff0087] via-[#ff008730] to-transparent z-0"
            animate={{ 
              opacity: [0.7, 0.9, 0.7, 0.8, 0.7],
              height: ["40vh", "42vh", "38vh", "43vh", "40vh"]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
          />
          
          <motion.div 
            className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#42c2dc20] to-transparent z-0"
            animate={{ 
              opacity: [0.3, 0.5, 0.3, 0.4, 0.3],
              height: ["30vh", "28vh", "32vh", "29vh", "30vh"]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", delay: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
