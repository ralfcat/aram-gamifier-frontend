// --- file: frontend/src/components/BackgroundMusic.tsx ---
import React, { useEffect } from 'react';

export default function BackgroundMusic() {
  useEffect(() => {
    const audio = new Audio('/bg-music.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    audio.play().catch(e => console.warn('Audio play failed:', e));
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return null; // no UI
}
