'use client'
import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react";

export default function GameControls({ 
  onHigher, 
  onLower, 
  onRestart, 
  disabled, 
  gameOver,
  guess,
  guessResult
}) {
  return (
    <div className="flex flex-col items-center space-y-6 z-10">
      {/* Game result message */}
      {guessResult !== null && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-bold mb-4 ${guessResult ? 'text-[#42c2dc]' : 'text-[#ff0087]'}`}
        >
          {guessResult 
            ? 'Correct! Keep going!' 
            : 'Game Over! Your guess was wrong.'}
        </motion.div>
      )}
      
      {/* Game controls */}
      <div className="flex space-x-6">
        <motion.button
          className={`px-8 py-4 bg-[#42c2dc] hover:bg-[#37a9c0] text-white rounded-none border-2 border-white shadow-lg text-lg font-bold tracking-wider flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          whileHover={!disabled ? { scale: 1.05, boxShadow: '0 0 15px rgba(66, 194, 220, 0.7)' } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          onClick={onHigher}
          disabled={disabled}
          style={{
            boxShadow: '0 0 10px rgba(66, 194, 220, 0.5)'
          }}
        >
          <ArrowUpCircle className="mr-2" size={24} />
          HIGHER
        </motion.button>
        
        <motion.button
          className={`px-8 py-4 bg-[#ff0087] hover:bg-[#d10070] text-white rounded-none border-2 border-white shadow-lg text-lg font-bold tracking-wider flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          whileHover={!disabled ? { scale: 1.05, boxShadow: '0 0 15px rgba(255, 0, 135, 0.7)' } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          onClick={onLower}
          disabled={disabled}
          style={{
            boxShadow: '0 0 10px rgba(255, 0, 135, 0.5)'
          }}
        >
          <ArrowDownCircle className="mr-2" size={24} />
          LOWER
        </motion.button>
      </div>
      
      {/* Restart button (visible when game is over) */}
      {gameOver && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-8 py-4 bg-white text-[#1a1a1a] hover:bg-gray-200 rounded-none border-2 border-[#42c2dc] shadow-lg text-lg font-bold tracking-wider flex items-center mt-4"
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 255, 255, 0.7)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
        >
          <RefreshCw className="mr-2" size={24} />
          PLAY AGAIN
        </motion.button>
      )}
    </div>
  );
}