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
          <linearGradient id="pickGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--primary) / 0.8)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
          </linearGradient>
          <linearGradient id="pickGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" />
            <stop offset="50%" stopColor="hsl(var(--muted-foreground) / 0.7)" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground) / 0.4)" />
          </linearGradient>
        </defs>

        {/* Guitar Pick Body */}
        <path
          d="M50 15 C60 15, 70 20, 75 30 C80 40, 80 50, 75 60 C70 70, 60 75, 50 75 C40 75, 30 70, 25 60 C20 50, 20 40, 25 30 C30 20, 40 15, 50 15 Z"
          fill="url(#pickGradient1)"
          stroke="hsl(var(--primary) / 0.3)"
          strokeWidth="2"
        />

        {/* Pick Hole */}
        <circle
          cx="50"
          cy="45"
          r="8"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="1"
        />

        {/* Pick Tip Highlight */}
        <path
          d="M50 15 C55 15, 60 18, 65 25 C70 32, 70 40, 65 45 C60 50, 55 52, 50 52"
          fill="none"
          stroke="hsl(var(--primary-foreground) / 0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Pick Edge Details */}
        <path
          d="M50 15 C40 15, 30 20, 25 30 C20 40, 20 50, 25 60 C30 70, 40 75, 50 75"
          fill="none"
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Musical Note */}
        <g transform="translate(50, 45)">
          <circle
            cx="0"
            cy="-8"
            r="3"
            fill="hsl(var(--primary-foreground))"
          />
          <path
            d="M3 -8 L3 -20 L8 -20 L8 -18 L5 -18 L5 -8"
            fill="hsl(var(--primary-foreground))"
          />
          <path
            d="M-2 -8 L-2 -12 L2 -12 L2 -8"
            fill="hsl(var(--primary-foreground))"
          />
        </g>
      </motion.svg>
    </motion.div>
  );
}
