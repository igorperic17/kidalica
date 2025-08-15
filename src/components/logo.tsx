"use client";
import { motion } from "framer-motion";

export function Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-10 h-10",
    large: "w-24 h-24",
  };

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]} ${className}`}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={{ rotate: -2 }}
        animate={{ rotate: 2 }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <defs>
          <linearGradient id="pickGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="30%" stopColor="hsl(var(--primary) / 0.9)" />
            <stop offset="70%" stopColor="hsl(var(--primary) / 0.7)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(142.1 76.2% 36.3%)" />
            <stop offset="50%" stopColor="hsl(147 51 234)" />
            <stop offset="100%" stopColor="hsl(236 72 153)" />
          </linearGradient>
          <radialGradient id="highlightGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(var(--primary-foreground) / 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Simple upside-down triangle with rounded edges */}
        <path
          d="M20 20 L80 20 L50 80 Z"
          fill="url(#pickGradient)"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="1.5"
        />

        {/* Accent gradient overlay */}
        <path
          d="M20 20 L80 20 L50 80 Z"
          fill="url(#accentGradient)"
          opacity="0.3"
        />

        {/* Highlight effect */}
        <path
          d="M20 20 L80 20 L50 80 Z"
          fill="url(#highlightGradient)"
        />

        {/* Letter "K" in the middle - bold cutout style */}
        <path
          d="M35 30 L35 70 M35 50 L55 35 M35 50 L55 65"
          stroke="hsl(var(--background))"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35 30 L35 70 M35 50 L55 35 M35 50 L55 65"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Subtle highlight on the pick */}
        <path
          d="M50 15 C60 15, 70 20, 75 30 C80 40, 80 50, 75 60 C70 70, 60 75, 50 75"
          fill="none"
          stroke="hsl(var(--primary-foreground) / 0.2)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </motion.svg>
    </motion.div>
  );
}
