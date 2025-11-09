'use client';

import { useEffect } from 'react';
import type { Track } from '@/types/track';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import styles from './style.module.scss';

interface TrackDetailModalProps {
  track: Track;
  onClose: () => void;
}

export function TrackDetailModal({ track, onClose }: TrackDetailModalProps) {
  const { getMediaUrl } = useMediaUrl();

  useEffect(() => {
    // Блокируем скролл body при открытии модалки
    document.body.style.overflow = 'hidden';

    // Обработчик Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const hasLyrics = track.lyrics && track.lyrics.trim().length > 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ✕
        </button>

        <div className={styles.contentGrid}>
          {/* Обложка */}
          <div className={styles.coverSection}>
            <div className={styles.coverWrapper}>
              <img
                src={track.cover ? getMediaUrl(track.cover) : '/assets/placeholder.png'}
                alt={track.title}
              />
            </div>
            <div className={styles.coverInfo}>
              <h2 className={styles.title}>{track.title}</h2>
              <p className={styles.artist}>{track.artist}</p>
            </div>
          </div>

          {/* Текст песни */}
          <div className={styles.lyricsSection}>
            <h3 className={styles.lyricsTitle}>Текст песни</h3>
            <div className={styles.lyricsText}>
              {hasLyrics ? (
                <pre>{track.lyrics}</pre>
              ) : (
                <p className={styles.noLyrics}>Текст песни отсутствует</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
