import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ColorShiftProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
}

export const ColorShift = ({ children, className = "", hoverScale = 1.05 }: ColorShiftProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        scale: hoverScale,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
        whileHover={{
          opacity: [0, 0.3, 0],
          background: [
            "radial-gradient(circle at 50% 50%, hsl(15, 92%, 58%, 0.3), transparent 50%)",
            "radial-gradient(circle at 50% 50%, hsl(265, 75%, 60%, 0.3), transparent 50%)",
            "radial-gradient(circle at 50% 50%, hsl(195, 100%, 55%, 0.3), transparent 50%)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {children}
    </motion.div>
  );
};
