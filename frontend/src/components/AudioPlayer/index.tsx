'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './style.module.scss';

interface AudioPlayerProps {
  src?: string;
}

export function AudioPlayer({ src = '/assets/songs/song.mp3' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to play audio:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePlay();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      <button
        className={`${styles.audioButton} ${isPlaying ? styles.isPlaying : ''}`}
        onClick={togglePlay}
        onKeyDown={handleKeyDown}
        aria-label={isPlaying ? 'Остановить музыку' : 'Проиграть музыку'}
        aria-pressed={isPlaying}
        role="button"
      >
        <img
          src="/assets/main/music.svg"
          alt=""
          className={styles.icon}
        />
        {isPlaying && <Equalizer />}
      </button>
    </>
  );
}

function Equalizer() {
  return (
    <span className={styles.eq}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={styles.eqBar} />
      ))}
    </span>
  );
}
