import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

export const RippleEffect = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [ripples, setRipples] = useState<RippleProps[]>([]);

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setRipples((prev) => [
      ...prev,
      {
        x,
        y,
        id: Date.now(),
      },
    ]);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseDown={addRipple}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{
              scale: 0,
              opacity: 0.8,
            }}
            animate={{
              scale: 4,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: "100px",
              height: "100px",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
