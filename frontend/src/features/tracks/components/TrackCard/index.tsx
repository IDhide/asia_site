'use client';

import { useState, useRef } from 'react';
import type { Track } from '@/types/track';
import styles from './style.module.scss';

interface TrackCardProps {
  track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const toggleLyrics = () => {
    setIsLyricsExpanded(!isLyricsExpanded);
  };

  return (
    <article className={styles.trackCard}>
      <div className={styles.trackCover}>
        {track.cover ? (
          <img
            src={track.cover}
            alt={`Обложка трека ${track.title}`}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholderCover} aria-label="Обложка отсутствует">
            <span>♪</span>
          </div>
        )}
      </div>

      <div className={styles.trackInfo}>
        <h3 className={styles.trackTitle}>{track.title}</h3>
        {track.artist && <p className={styles.trackArtist}>{track.artist}</p>}
      </div>

      {track.audio_file && (
        <div className={styles.trackControls}>
          <button
            type="button"
            className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <audio
            ref={audioRef}
            src={track.audio_file}
            onEnded={handleEnded}
            preload="metadata"
          />
        </div>
      )}

      {track.lyrics && (
        <div className={styles.trackLyrics}>
          <button
            type="button"
            className={styles.lyricsToggle}
            onClick={toggleLyrics}
            aria-expanded={isLyricsExpanded}
            aria-controls={`lyrics-${track.id}`}
          >
            {isLyricsExpanded ? 'Скрыть текст' : 'Показать текст'}
          </button>
          {isLyricsExpanded && (
            <div
              id={`lyrics-${track.id}`}
              className={styles.lyricsContent}
            >
              <pre>{track.lyrics}</pre>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
