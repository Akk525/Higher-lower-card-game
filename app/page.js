'use client'
import { useState, useEffect } from "react";
import { getRandomCard } from "../utils/fetchCard";
import { motion } from "framer-motion";

export default function Home() {
  const [currentCard, setCurrentCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewCard, setIsNewCard] = useState(false);
  const [error, setError] = useState(null);
  const [showFront, setShowFront] = useState(true);

  useEffect(() => {
    fetchNewCard();
  }, []);

  async function fetchNewCard() {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching new card...");
      const card = await getRandomCard();
      console.log("Card received:", card);
      
      if (card) {
        setCurrentCard(card);
        setIsNewCard(true);
        setShowFront(false);
        setTimeout(() => {
          setShowFront(true);
          setIsNewCard(false);
        }, 500);
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

  const getCardColor = (suit) => {
    return ['hearts', 'diamonds'].includes(suit?.toLowerCase()) ? 'text-[#ff0087]' : 'text-[#42c2dc]';
  };

  const getSuitSymbol = (suit) => {
    if (!suit) return '';
    const symbols = {
      'hearts': '♥',
      'diamonds': '♦',
      'clubs': '♣',
      'spades': '♠'
    };
    return symbols[suit.toLowerCase()] || suit;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 font-mono relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #1a1a1a, #0d0d0d)',
      }}
    >
      {/* Background patterns inspired by Squid Game */}
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
        <div className="absolute top-[20%] left-[10%] w-20 h-20 rounded-full border-4 border-[#ff0087]"></div>
        <div className="absolute top-[40%] left-[80%] w-16 h-16 border-4 border-[#42c2dc]"></div>
        <div className="absolute top-[70%] left-[20%] w-14 h-14 border-4 border-[#42c2dc]" 
             style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
        <div className="absolute top-[30%] left-[50%] w-16 h-16 border-4 border-[#ff0087] rounded"></div>
        <div className="absolute top-[60%] left-[70%] w-12 h-12 rounded-full border-4 border-[#ff0087]"></div>
      </div>
      
      {/* Game title with Squid Game style */}
      <motion.div
        className="mb-12 text-center relative z-10"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h1 className="text-6xl font-bold text-[#ff0087] tracking-wider">
          CARD GAME
        </h1>
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center space-x-4">
          <div className="w-10 h-10 bg-[#42c2dc] rounded-full"></div>
          <div className="w-10 h-10 bg-[#ff0087] rounded"></div>
          <div className="w-10 h-10 bg-[#42c2dc]" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
        </div>
      </motion.div>
      
      {error && (
        <div className="bg-[#ff0087] text-white p-4 rounded-md mb-4 border-2 border-white z-10">
          {error}
        </div>
      )}
      
      {currentCard ? (
        <motion.div 
          className="relative w-64 h-96 rounded-xl overflow-hidden shadow-2xl bg-white mb-8 border-4 border-[#ff0087] z-10"
          initial={{ rotateY: 180 }}
          animate={{ rotateY: isNewCard ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{
            boxShadow: '0 0 30px rgba(255, 0, 135, 0.3)'
          }}
        >
          {showFront ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-between p-6"
            >
              <div className={`text-3xl font-bold self-start ${getCardColor(currentCard.suit)}`}>
                {currentCard.rank}
                <span className="ml-1">{getSuitSymbol(currentCard.suit)}</span>
              </div>
              
              <div className={`text-8xl ${getCardColor(currentCard.suit)}`}>
                {getSuitSymbol(currentCard.suit)}
              </div>
              
              <div className={`text-3xl font-bold self-end rotate-180 ${getCardColor(currentCard.suit)}`}>
                {currentCard.rank}
                <span className="ml-1">{getSuitSymbol(currentCard.suit)}</span>
              </div>
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-[#ff0087] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full mb-4"></div>
                <div className="w-16 h-16 bg-white" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="w-64 h-96 rounded-xl bg-[#1a1a1a] flex items-center justify-center border-4 border-[#ff0087] z-10"
          animate={{ opacity: loading ? [0.5, 1, 0.5] : 1 }}
          transition={{ repeat: loading ? Infinity : 0, duration: 1.5 }}
          style={{
            boxShadow: '0 0 30px rgba(255, 0, 135, 0.3)'
          }}
        >
          <div className="flex flex-col items-center">
            <motion.div 
              animate={{ rotate: loading ? 360 : 0 }}
              transition={{ repeat: loading ? Infinity : 0, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-t-4 border-[#42c2dc] rounded-full mb-4"
            ></motion.div>
            <p className="text-xl font-bold text-[#42c2dc]">Loading...</p>
          </div>
        </motion.div>
      )}
      
      <div className="flex space-x-4 mt-8 z-10">
        <motion.button
          className="px-10 py-4 bg-[#ff0087] hover:bg-[#d10070] text-white rounded-none border-2 border-white shadow-lg text-lg font-bold tracking-wider"
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 0, 135, 0.7)' }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchNewCard}
          disabled={loading}
          style={{
            boxShadow: '0 0 10px rgba(255, 0, 135, 0.5)'
          }}
        >
          {loading ? 'LOADING...' : 'NEXT CARD'}
        </motion.button>
      </div>

      {/* Pink light effect */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#ff0087] via-[#ff008730] to-transparent z-0"></div>
      
      {/* Teal light effect from top */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#42c2dc20] to-transparent z-0"></div>
    </motion.div>
  );
}
