'use client'
import { motion } from "framer-motion";

export default function GameHeader() {
  return (
    <motion.div
      className="mb-12 text-center relative z-10"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <h1 className="text-6xl font-bold text-[#ff0087] tracking-wider">
        HIGHER LOWER
      </h1>
      <div className="absolute -bottom-16 left-0 right-0 flex justify-center space-x-4">
        <motion.div 
          className="w-10 h-10 bg-[#42c2dc] rounded-full"
          animate={{ 
            scale: [1, 1.1, 1, 0.95, 1],
            rotate: [0, 0, 0, 0, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div 
          className="w-10 h-10 bg-[#ff0087] rounded"
          animate={{ 
            scale: [1, 0.95, 1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
        />
        <motion.div 
          className="w-10 h-10 bg-[#42c2dc]"
          style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}
          animate={{ 
            scale: [1, 1.05, 0.95, 1.05, 1],
            rotate: [0, -5, 0, 5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay: 1 }}
        />
      </div>
    </motion.div>
  );
}