import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=80',
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // Auto-slide هر 5 ثانیه
  useEffect(() => {
    const timer = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden">
      <AnimatePresence>
        {images.map((img, idx) =>
          idx === current ? (
            <motion.img
              key={idx}
              src={img}
              alt={`Afghanistan slide ${idx+1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            />
          ) : null
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/40 to-transparent z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-16">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Discover Afghanistan with Group Tours
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-white mb-8 max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Experience breathtaking landscapes, rich culture, and unforgettable
          adventures. Join our expertly guided group tours for memories that
          last a lifetime.
        </motion.p>

        <motion.a
          href="#tours"
          className="inline-block bg-yellow-400 text-blue-900 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-yellow-300 transition text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Explore Tours
        </motion.a>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/70 hover:bg-white text-blue-900 rounded-full p-3 shadow-md transition"
      >
        {/* SVG arrow */}
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/70 hover:bg-white text-blue-900 rounded-full p-3 shadow-md transition"
      >
        {/* SVG arrow */}
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full border-2 border-white ${
              idx === current
                ? 'bg-yellow-400 border-yellow-400'
                : 'bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
