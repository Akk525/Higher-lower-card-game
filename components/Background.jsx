'use client'
import { motion } from "framer-motion";

export default function Background() {
  return (
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
      <motion.div 
        className="absolute w-16 h-16 border-4 border-[#42c2dc]"
        initial={{ top: "40%", left: "80%" }}
        animate={{ 
          top: ["40%", "43%", "38%", "41%", "40%"], 
          left: ["80%", "78%", "82%", "79%", "80%"],
          rotate: [0, -15, 5, -10, 0],
          scale: [1, 0.95, 1.03, 0.98, 1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          repeatType: "mirror",
          delay: 0.5
        }}
      />
      <motion.div 
        className="absolute w-14 h-14 border-4 border-[#42c2dc]"
        style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}
        initial={{ top: "70%", left: "20%" }}
        animate={{ 
          top: ["70%", "68%", "72%", "69%", "70%"], 
          left: ["20%", "22%", "18%", "21%", "20%"],
          rotate: [0, 20, -10, 5, 0],
          scale: [1, 1.08, 0.95, 1.03, 1]
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          repeatType: "mirror",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute w-16 h-16 border-4 border-[#ff0087] rounded"
        initial={{ top: "30%", left: "50%" }}
        animate={{ 
          top: ["30%", "28%", "32%", "29%", "30%"], 
          left: ["50%", "48%", "53%", "51%", "50%"],
          rotate: [0, -5, 15, -10, 0],
          scale: [1, 0.97, 1.05, 0.99, 1]
        }}
        transition={{ 
          duration: 22, 
          repeat: Infinity, 
          repeatType: "mirror",
          delay: 1.5
        }}
      />
      <motion.div 
        className="absolute w-12 h-12 rounded-full border-4 border-[#ff0087]"
        initial={{ top: "60%", left: "70%" }}
        animate={{ 
          top: ["60%", "63%", "58%", "61%", "60%"], 
          left: ["70%", "68%", "72%", "71%", "70%"],
          rotate: [0, 15, -10, 5, 0],
          scale: [1, 1.04, 0.96, 1.02, 1]
        }}
        transition={{ 
          duration: 17, 
          repeat: Infinity, 
          repeatType: "mirror",
          delay: 2
        }}
      />
      
      {/* Additional floating elements */}
      <motion.div 
        className="absolute w-8 h-8 border-4 border-[#ff0087]"
        style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}
        initial={{ top: "15%", left: "40%", opacity: 0.5 }}
        animate={{ 
          top: ["15%", "18%", "12%", "16%", "15%"], 
          left: ["40%", "38%", "42%", "39%", "40%"],
          rotate: [0, 30, -15, 10, 0],
          scale: [1, 0.9, 1.1, 0.95, 1],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          repeatType: "mirror",
          delay: 2.5
        }}
      />
      <motion.div 
        className="absolute w-10 h-10 rounded-full border-4 border-[#42c2dc]"
        initial={{ top: "50%", left: "30%", opacity: 0.7 }}
        animate={{ 
          top: ["50%", "52%", "48%", "51%", "50%"], 
          left: ["30%", "28%", "32%", "29%", "30%"],
          rotate: [0, -20, 10, -5, 0],
          scale: [1, 1.06, 0.94, 1.01, 1],
        }}
        transition={{ 
          duration: 19, 
          repeat: Infinity, 
          repeatType: "mirror",
          delay: 3
        }}
      />
    </div>
  );
}