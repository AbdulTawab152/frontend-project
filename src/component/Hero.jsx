import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80',
    caption: 'Majestic Mountains of Afghanistan',
  },
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80',
    caption: 'Serene Lakes and Reflections',
  },
  {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=80',
    caption: 'Historic Architecture and Culture',
  },
  {
    url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=80',
    caption: 'Adventure Awaits in Every Corner',
  },
];

const AUTO_SLIDE_INTERVAL = 6000;

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef();

  const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // Auto-slide and progress bar
  useEffect(() => {
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          nextSlide();
          return 0;
        }
        return p + 100 / (AUTO_SLIDE_INTERVAL / 100);
      });
    }, 100);
    return () => clearInterval(progressRef.current);
  }, [current]);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      {/* Removed Animated Background Gradient Circles */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 right-10 w-72 h-72 bg-blue-300 opacity-20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl animate-pulse" />
      </div> */}

      <AnimatePresence>
        {images.map((img, idx) =>
          idx === current ? (
            <motion.img
              key={idx}
              src={img.url}
              alt={img.caption}
              className="absolute inset-0 w-full h-full object-cover z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{ filter: 'brightness(0.7)' }}
            />
          ) : null
        )}
      </AnimatePresence>

      {/* Removed Overlay for better text readability */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/40 to-transparent z-20" /> */}

      {/* Arrow Buttons - Top Left */}
      <div className="absolute top-8 left-8 z-50 flex space-x-3">
        <button
          onClick={prevSlide}
          className="bg-white/80 hover:bg-blue-800 text-blue-900 hover:text-white rounded-full p-2 shadow-xl transition border-2 border-white hover:border-blue-800 focus:outline-none"
          aria-label="Previous slide"
          style={{ minWidth: 32, minHeight: 32 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="bg-white/80 hover:bg-blue-800 text-blue-900 hover:text-white rounded-full p-2 shadow-xl transition border-2 border-white hover:border-blue-800 focus:outline-none"
          aria-label="Next slide"
          style={{ minWidth: 32, minHeight: 32 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slide Caption */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4">
        <motion.div
          key={current}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-blue-900/70 text-white text-lg md:text-2xl font-semibold rounded-xl px-6 py-4 shadow-lg backdrop-blur-md text-center"
        >
          {images[current].caption}
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 z-40">
        <div className="h-full bg-blue-300 transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative z-40 flex flex-col items-center justify-center text-center px-4 py-10 w-full max-w-3xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-black text-white drop-shadow-xl mb-3 tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Discover Afghanistan with <span className="text-blue-300">Group Tours</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Experience breathtaking landscapes, rich culture, and unforgettable adventures. Join our expertly guided group tours for memories that last a lifetime.
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
