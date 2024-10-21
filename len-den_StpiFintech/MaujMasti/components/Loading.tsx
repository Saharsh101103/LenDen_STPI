'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  isLoading: boolean;
}

export const Loader = ({ isLoading }: LoaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 20 : 100));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <motion.div
          className="w-16 h-24 grid grid-cols-4 grid-rows-6 gap-0"
          animate={isLoading ? 'running' : 'celebrating'}
        >
          {/* Character's body */}
          <motion.div className="col-span-4 row-span-3 bg-red-500 rounded-t-lg" />

          {/* Character's left arm */}
          <motion.div
            className="col-span-1 row-span-2 bg-red-500 rounded-lg"
            variants={{
              running: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.5 } },
              celebrating: { y: -10, x: -5, transition: { duration: 0.5, type: 'spring' } },
            }}
          />

          {/* Character's right arm */}
          <motion.div
            className="col-start-4 col-span-1 row-span-2 bg-red-500 rounded-lg"
            variants={{
              running: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.5 } },
              celebrating: { y: -10, x: 5, transition: { duration: 0.5, type: 'spring' } },
            }}
          />

          {/* Character's left leg */}
          <motion.div
            className="col-span-1 row-span-1 bg-blue-500 rounded-lg"
            variants={{
              running: { y: [0, 5, 0], transition: { repeat: Infinity, duration: 0.25 } },
              celebrating: { y: 5, transition: { duration: 0.5 } },
            }}
          />

          {/* Character's right leg */}
          <motion.div
            className="col-start-4 col-span-1 row-span-1 bg-blue-500 rounded-lg"
            variants={{
              running: { y: [5, 0, 5], transition: { repeat: Infinity, duration: 0.25 } },
              celebrating: { y: 5, transition: { duration: 0.5 } },
            }}
          />
        </motion.div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
      </div>

      {/* Progress bar */}
      <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 10 }}
        />
      </div>
    </div>
  );
};
