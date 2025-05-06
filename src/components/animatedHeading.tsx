'use client'

import React, { useEffect, useState } from 'react';
import './animatedHeader.css';

interface SentenceSliderProps {
  sentences: string[];
}

const SentenceSlider: React.FC<SentenceSliderProps> = ({ sentences }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState('slide-in');

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation('slide-out');
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        setAnimation('slide-in');
      }, 1000); // Duration of slide-out before changing text
    }, 4000);

    return () => clearInterval(interval);
  }, [sentences.length]);

  return (
    <div className="slider-container z-999 text-text">
      <div key={currentIndex} className={`sentence ${animation}`}>
        {sentences[currentIndex]}
      </div>
    </div>
  );
};

export default SentenceSlider;
