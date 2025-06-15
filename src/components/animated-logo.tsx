"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const words = ["me", "ഞാൻ", "मैं", "நான்"];

export const AnimatedLogo = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex w-fit items-center justify-center gap-1.5 text-center text-xl font-bold tracking-wider">
      /
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-16"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      /
    </div>
  );
};
