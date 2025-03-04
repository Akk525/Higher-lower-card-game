'use client'
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Card({ 
  card, 
  isNew, 
  showFront = true,
  isRevealing = false,
  guessResult = null
}) {
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (isNew || isRevealing) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isNew, isRevealing]);

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
  
  // Function to render the card content based on rank
  const renderCardContent = (card) => {
    const isFaceCard = ['K', 'Q', 'J'].includes(card.rank);
    
    if (isFaceCard) {
      // Face card with image
      return (
        <>
          <div className={`text-2xl font-bold self-start ${getCardColor(card.suit)}`}>
            {card.rank}
            <span className="ml-1">{getSuitSymbol(card.suit)}</span>
          </div>
          
          <div className={`relative w-32 h-40 flex items-center justify-center my-2 ${getCardColor(card.suit)}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              {card.rank === 'K' && (
                <svg className="w-full h-full" viewBox="0 0 100 120" fill="currentColor">
                  <path d="M50,10 C45,25 35,35 20,35 C20,60 35,75 50,90 C65,75 80,60 80,35 C65,35 55,25 50,10 Z" />
                  <rect x="40" y="45" width="20" height="5" />
                  <rect x="30" y="55" width="40" height="5" />
                  <path d="M30,65 L70,65 L65,85 L35,85 Z" />
                  <rect x="35" y="90" width="30" height="5" />
                  <rect x="45" y="100" width="10" height="5" />
                  <circle cx="35" cy="45" r="5" />
                  <circle cx="65" cy="45" r="5" />
                </svg>
              )}
              
              {card.rank === 'Q' && (
                <svg className="w-full h-full" viewBox="0 0 100 120" fill="currentColor">
                  <circle cx="50" cy="30" r="15" />
                  <path d="M30,40 L70,40 L75,95 L65,100 L50,90 L35,100 L25,95 Z" />
                  <path d="M40,55 L60,55 L55,75 L45,75 Z" />
                  <circle cx="40" cy="35" r="3" />
                  <circle cx="60" cy="35" r="3" />
                  <path d="M45,40 C48,45 52,45 55,40" strokeWidth="2" stroke="currentColor" fill="none" />
                </svg>
              )}
              
              {card.rank === 'J' && (
                <svg className="w-full h-full" viewBox="0 0 100 120" fill="currentColor">
                  <rect x="40" y="10" width="20" height="25" />
                  <path d="M25,35 L75,35 L65,75 L35,75 Z" />
                  <path d="M40,75 L45,100 L55,100 L60,75" />
                  <circle cx="40" cy="50" r="5" />
                  <circle cx="60" cy="50" r="5" />
                </svg>
              )}
            </div>
          </div>
          
          <div className={`text-2xl font-bold self-end rotate-180 ${getCardColor(card.suit)}`}>
            {card.rank}
            <span className="ml-1">{getSuitSymbol(card.suit)}</span>
          </div>
        </>
      );
    } else {
      // Regular card
      return (
        <>
          <div className={`text-3xl font-bold self-start ${getCardColor(card.suit)}`}>
            {card.rank}
            <span className="ml-1">{getSuitSymbol(card.suit)}</span>
          </div>
          
          <div className={`text-8xl ${getCardColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>
          
          <div className={`text-3xl font-bold self-end rotate-180 ${getCardColor(card.suit)}`}>
            {card.rank}
            <span className="ml-1">{getSuitSymbol(card.suit)}</span>
          </div>
        </>
      );
    }
  };
  
  // Get card border color based on result
  const getCardBorderColor = () => {
    if (guessResult === true) return 'border-[#42c2dc]'; // Correct guess (teal)
    if (guessResult === false) return 'border-[#ff0087]'; // Wrong guess (pink)
    return 'border-[#ff0087]'; // Default (pink)
  };

  // The actual display state - this determines if we're showing front or back
  const displayFront = showFront || (isRevealing && !isFlipping);

  return (
    <div className="perspective-1000">
      <motion.div 
        className={`relative w-64 h-96 rounded-xl overflow-hidden shadow-2xl bg-white border-4 ${getCardBorderColor()} z-10`}
        initial={{ rotateY: showFront ? 0 : 180 }}
        animate={{ 
          rotateY: displayFront ? 0 : 180,
          scale: guessResult !== null ? [1, 1.05, 1] : 1
        }}
        transition={{ duration: 0.6 }}
        style={{
          boxShadow: guessResult === true ? '0 0 30px rgba(66, 194, 220, 0.6)' : '0 0 30px rgba(255, 0, 135, 0.3)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-between p-6 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {card && renderCardContent(card)}
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 bg-[#ff0087] flex items-center justify-center backface-hidden"
          style={{ 
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            {/* Squid Game shapes in vertical arrangement */}
            <motion.div 
              className="w-16 h-16 bg-white rounded-full mb-6"
              animate={{ scale: [1, 1.05, 1, 0.98, 1] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div 
              className="w-16 h-16 bg-white rounded mb-6"
              animate={{ scale: [1, 0.98, 1, 1.05, 1], rotate: [0, 2, 0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
            />
            <motion.div 
              className="w-16 h-16 bg-white"
              style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}
              animate={{ scale: [1, 1.03, 0.97, 1.03, 1], rotate: [0, -2, 0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: 1 }}
            />
            
            {/* Card border decorative elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full opacity-40"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white rounded opacity-40"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-white opacity-40" 
                style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-white rounded-full opacity-40"></div>
          </div>
          
          {/* Card border */}
          <div className="absolute inset-5 border border-white opacity-30 rounded-lg"></div>
        </div>
      </motion.div>
    </div>
  );
}