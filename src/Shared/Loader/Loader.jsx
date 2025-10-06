/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#3489BD] via-[#65B0D5] to-[#2E7A7A] text-white z-[9999]">
      {/* Animated circles */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <motion.div
          className="absolute w-24 h-24 border-4 border-t-transparent border-[#EDF6F8] rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-16 h-16 border-4 border-t-transparent border-[#144D75] rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-8 h-8 bg-[#EDF6F8] rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loader text */}
      <motion.p
        className="mt-6 text-xl font-semibold tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
      >
        Loading<span className="text-[#EDF6F8]">...</span>
      </motion.p>
    </div>
  );
}
