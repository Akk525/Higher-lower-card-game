'use client'
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Card({ 
  card, 
  isNew, 
  showFront = false, // Default to false (face down)
  isRevealing = false,
  guessResult = null
}) {
  if (!card) return null;

  const getCardColor = (suit) => {
    return ['hearts', 'diamonds'].includes(suit?.toLowerCase()) ? 'text-[#ff0087]' : 'text-[#42c2dc]';
  };

  const getSuitSymbol = (suit) => {
    switch (suit.toLowerCase()) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit) => {
    if (suit.toLowerCase() === 'hearts' || suit.toLowerCase() === 'diamonds') {
      return 'text-red-600';
    }
    return 'text-black';
  };

  const getCardValue = (value) => {
    switch (value) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      default: return value.toString();
    }
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
          <div className={`text-3xl sm:text-4xl md:text-5xl font-bold self-start ${getCardColor(card.suit)}`}>
            {card.rank}
            <span className="ml-1 text-4xl sm:text-5xl md:text-6xl">{getSuitSymbol(card.suit)}</span>
          </div>
          
          <div className={`text-8xl ${getCardColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>
          
          <div className={`text-3xl sm:text-4xl md:text-5xl font-bold self-end rotate-180 ${getCardColor(card.suit)}`}>
            {card.rank}
            <span className="ml-1 text-4xl sm:text-5xl md:text-6xl">{getSuitSymbol(card.suit)}</span>
          </div>
        </>
      );
    }
  };
  
  // Get card border color based on result
  const getCardBorderColor = () => {
    if (guessResult === true) return 'border-[#42c2dc]'; // Correct guess (teal)
    if (guessResult === false) return 'border-[#ff0087]'; // Wrong guess (pink)
    return 'border-white'; // Default (white)
  };

  return (
    <div className="perspective-1000">
      <motion.div 
        className={`relative w-48 h-72 sm:w-56 sm:h-80 md:w-64 md:h-96 rounded-xl overflow-hidden shadow-2xl bg-white border-4 ${getCardBorderColor()} z-10`}
        initial={{ rotateY: showFront ? 0 : 180 }}
        animate={{ 
          rotateY: showFront ? 0 : 180, // This is crucial - must use the showFront prop directly
          scale: guessResult !== null ? [1, 1.05, 1] : 1
        }}
        transition={{ duration: 0.6 }}
        style={{
          boxShadow: guessResult === true ? '0 0 30px rgba(66, 194, 220, 0.6)' : '0 0 30px rgba(255, 0, 135, 0.3)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front of card */}
        <motion.div 
          className="absolute w-full h-full backface-hidden bg-white"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: showFront ? 'rotateY(0deg)' : 'rotateY(180deg)'
          }}
        >
          {/* Card corners */}
          <div className="absolute top-4 left-4">
            <div className={`font-bold text-2xl sm:text-3xl ${getSuitColor(card.suit)}`}>
              {getCardValue(card.value)}
            </div>
            <div className={`text-2xl sm:text-3xl ${getSuitColor(card.suit)}`}>
              {getSuitSymbol(card.suit)}
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 transform rotate-180">
            <div className={`font-bold text-2xl sm:text-3xl ${getSuitColor(card.suit)}`}>
              {getCardValue(card.value)}
            </div>
            <div className={`text-2xl sm:text-3xl ${getSuitColor(card.suit)}`}>
              {getSuitSymbol(card.suit)}
            </div>
          </div>
          
          {/* Large centered suit symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-8xl sm:text-9xl md:text-[10rem] font-bold ${getSuitColor(card.suit)}`}>
              {getSuitSymbol(card.suit)}
            </div>
          </div>
        </motion.div>
        
        {/* Squid Game themed back */}
        <motion.div 
          className="absolute w-full h-full backface-hidden bg-[#1a1a1a] flex items-center justify-center"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: showFront ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Squid Game style card back */}
          <div className="w-full h-full p-4 flex flex-col items-center justify-between">
            {/* Top patterns */}
            <div className="flex justify-center space-x-3 mt-2">
              <div className="w-10 h-10 bg-[#42c2dc] rounded-full"></div>
              <div className="w-10 h-10 bg-[#ff0087] rounded"></div>
              <div className="w-10 h-10 bg-[#42c2dc]" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
            </div>
            
            {/* Center logo */}
            <div className="border-4 border-white rounded-lg p-8 flex flex-col items-center justify-center">
              <div className="text-white font-bold text-4xl mb-2">CARD</div>
              <div className="flex justify-center space-x-2">
                <div className="w-4 h-4 bg-[#42c2dc] rounded-full"></div>
                <div className="w-4 h-4 bg-[#ff0087] rounded"></div>
                <div className="w-4 h-4 bg-[#42c2dc]" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
              </div>
              <div className="text-white font-bold text-4xl mt-2">GAME</div>
            </div>
            
            {/* Bottom patterns */}
            <div className="flex justify-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-[#ff0087]" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
              <div className="w-10 h-10 bg-[#42c2dc] rounded"></div>
              <div className="w-10 h-10 bg-[#ff0087] rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}