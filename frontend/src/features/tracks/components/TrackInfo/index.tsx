'use client';

import type { SliderItem } from '@/types/track';
import styles from './style.module.scss';

interface TrackInfoProps {
  track: SliderItem;
  onLyricsClick: () => void;
}

const SOCIAL_LINKS = [
  { name: 'YouTube Music', icon: '/assets/tracks_icons/youtubemusic.svg', url: '#' },
  { name: 'Spotify', icon: '/assets/tracks_icons/spotify.svg', url: '#' },
  { name: 'Apple Music', icon: '/assets/tracks_icons/apple_music.svg', url: '#' },
  { name: 'Сбер Звук', icon: '/assets/tracks_icons/sber_zvuk.svg', url: '#' },
  { name: 'Яндекс Музыка', icon: '/assets/tracks_icons/yan_music.svg', url: '#' },
  { name: 'VK Музыка', icon: '/assets/tracks_icons/vk_music.svg', url: '#' },
];

export function TrackInfo({ track, onLyricsClick }: TrackInfoProps) {
  // Проверяем, является ли элемент треком (у альбомов нет поля lyrics)
  const hasLyrics = 'lyrics' in track && track.lyrics && track.lyrics.trim().length > 0;

  return (
    <div className={styles.trackInfo}>
      <div className={styles.header}>
        <div className={styles.textSection}>
          <h2 className={styles.trackTitle}>{track.title}</h2>
          <p className={styles.trackArtist}>{track.artist}</p>
        </div>

        <div className={styles.rightSection}>
{/*           хардкод тт */}

{/*           {hasLyrics && (
            <button
              className={styles.lyricsButton}
              onClick={onLyricsClick}
              aria-label="Показать текст песни"
            >
              Тт
            </button>
          )} */}
          {track.year && (
            <span className={styles.year}>{track.year}</span>
          )}
        </div>
      </div>

      <div className={styles.socialButtons}>
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.name}
            href={social.url}
            className={styles.socialButton}
            aria-label={social.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={social.icon} alt="" />
          </a>
        ))}
      </div>
    </div>
  );
}
