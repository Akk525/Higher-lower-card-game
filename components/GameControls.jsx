'use client'
import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react";

export default function GameControls({ 
  onHigher, 
  onLower, 
  onRestart, 
  gameOver, 
  loading = false,
  showButtons = true,  // This might be causing your issue
  guess = null
}) {
  return (
    <motion.div 
      className="flex justify-center items-center space-x-4 z-10 mt-2"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {gameOver ? (
        <motion.button
          className="px-6 py-3 bg-[#42c2dc] hover:bg-[#35a3b9] text-white rounded-none border-2 border-white shadow-lg text-base font-bold tracking-wider flex items-center"
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(66, 194, 220, 0.7)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
        >
          <RefreshCw size={20} className="mr-2" />
          PLAY AGAIN
        </motion.button>
      ) : (
        // Remove the showButtons condition or fix the logic in page.js that sets showButtons
        <>
          <motion.button
            className={`px-4 py-3 ${guess === true ? 'bg-white text-[#42c2dc]' : 'bg-[#42c2dc] text-white'} hover:bg-[#35a3b9] hover:text-white rounded-none border-2 border-white shadow-lg text-base font-bold tracking-wider flex items-center`}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(66, 194, 220, 0.7)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onHigher}
            disabled={loading}
          >
            <ArrowUpCircle size={20} className="mr-2" />
            HIGHER
          </motion.button>
          
          <motion.button
            className={`px-4 py-3 ${guess === false ? 'bg-white text-[#ff0087]' : 'bg-[#ff0087] text-white'} hover:bg-[#d10070] hover:text-white rounded-none border-2 border-white shadow-lg text-base font-bold tracking-wider flex items-center`}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 0, 135, 0.7)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onLower}
            disabled={loading}
          >
            <ArrowDownCircle size={20} className="mr-2" />
            LOWER
          </motion.button>
        </>
      )}
    </motion.div>
  );
}