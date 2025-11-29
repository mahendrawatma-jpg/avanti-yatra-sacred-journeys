import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
}

const colors = [
  "hsl(15, 92%, 58%)",   // Primary coral-orange
  "hsl(265, 75%, 60%)",  // Secondary purple
  "hsl(195, 100%, 55%)", // Accent cyan
  "hsl(280, 75%, 65%)",  // Divine glow
  "hsl(45, 95%, 55%)",   // Golden hour
];

export const ParticleBurst = ({ 
  trigger, 
  count = 12,
  className = "" 
}: { 
  trigger: boolean; 
  count?: number;
  className?: string;
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i;
        newParticles.push({
          id: Date.now() + i,
          x: 0,
          y: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle,
        });
      }
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [trigger, count]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: "50%",
              y: "50%",
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: `calc(50% + ${Math.cos((particle.angle * Math.PI) / 180) * 100}px)`,
              y: `calc(50% + ${Math.sin((particle.angle * Math.PI) / 180) * 100}px)`,
              scale: 0,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
