"use client";
import { motion } from "framer-motion";

export function Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "h-6 w-6",
    default: "h-8 w-8", 
    large: "h-12 w-12"
  };

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Guitar Body */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={{ rotate: -5 }}
        animate={{ rotate: 5 }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        {/* Guitar Body */}
        <motion.path
          d="M12 2C8.5 2 6 4.5 6 8v8c0 3.5 2.5 6 6 6s6-2.5 6-6V8c0-3.5-2.5-6-6-6z"
          fill="url(#gradient1)"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Guitar Neck */}
        <motion.path
          d="M10 8h4v8h-4z"
          fill="url(#gradient2)"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        
        {/* Strings */}
        <motion.line
          x1="10.5" y1="9" x2="10.5" y2="15"
          stroke="currentColor"
          strokeWidth="0.5"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />
        <motion.line
          x1="11.5" y1="9" x2="11.5" y2="15"
          stroke="currentColor"
          strokeWidth="0.5"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        />
        <motion.line
          x1="12.5" y1="9" x2="12.5" y2="15"
          stroke="currentColor"
          strokeWidth="0.5"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        />
        <motion.line
          x1="13.5" y1="9" x2="13.5" y2="15"
          stroke="currentColor"
          strokeWidth="0.5"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        />
        
        {/* Sound Hole */}
        <motion.circle
          cx="12" cy="12" r="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
        
        {/* Music Notes */}
        <motion.path
          d="M4 6l2 2 2-2M8 6l2 2 2-2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        />
        
        <motion.path
          d="M16 6l2 2 2-2M20 6l2 2 2-2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
        />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground))" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground) / 0.5)" />
          </linearGradient>
        </defs>
      </motion.svg>
      
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.div>
  );
}
