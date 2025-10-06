/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#3489BD] via-[#65B0D5] to-[#2E7A7A] text-white p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-72 h-72 bg-[#144D75]/30 rounded-full blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      {/* Lock Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="flex flex-col items-center"
      >
        <FaLock className="text-7xl mb-4 text-white drop-shadow-xl" />
      </motion.div>

      {/* 403 Text */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-8xl font-extrabold drop-shadow-lg"
      >
        403
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg mt-4 text-white/90 text-center max-w-md"
      >
        🚫 Oops! You don’t have permission to access this page. Please contact
        your administrator or go back to a safe page.
      </motion.p>

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Link
          to="/login"
          className="btn bg-[#2E7A7A] hover:bg-[#144D75] text-white border-none text-lg shadow-lg"
        >
        Back to Login Page
        </Link>
      </motion.div>
    </div>
  );
}
