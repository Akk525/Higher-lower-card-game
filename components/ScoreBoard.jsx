'use client'
import { motion } from "framer-motion";

export default function ScoreBoard({ score, highScore, gameOver }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex justify-center space-x-8 mb-4 z-10 text-center"
    >
      <div className="text-center">
        <div className="text-sm text-white opacity-60">CURRENT STREAK</div>
        <motion.div
          key={score} // Force animation when score changes
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className={`text-2xl font-bold ${gameOver ? 'text-[#ff0087]' : 'text-white'}`}
        >
          {score}
        </motion.div>
      </div>
      
      <div className="text-center">
        <div className="text-sm text-white opacity-60">HIGH SCORE</div>
        <motion.div
          key={highScore} // Force animation when high score changes
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-[#42c2dc]"
        >
          {highScore}
        </motion.div>
      </div>
    </motion.div>
  );
}