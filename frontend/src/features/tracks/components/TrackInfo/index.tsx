'use client';

import type { SliderItem } from '@/types/track';
import styles from './style.module.scss';

interface TrackInfoProps {
  track: SliderItem;
  onLyricsClick: () => void;
}

const SOCIAL_LINKS = [
  { name: 'YouTube Music', icon: '/assets/social_icons/social_youtube.svg', url: '#' },
  { name: 'Spotify', icon: '/assets/social_icons/spotify.svg', url: '#' },
  { name: 'Apple Music', icon: '/assets/social_icons/apple-music.svg', url: '#' },
  { name: 'Сбер Звук', icon: '/assets/social_icons/sber.svg', url: '#' },
  { name: 'Яндекс Музыка', icon: '/assets/social_icons/yandex-music.svg', url: '#' },
  { name: 'VK Музыка', icon: '/assets/social_icons/social_vk.svg', url: '#' },
];

export function TrackInfo({ track, onLyricsClick }: TrackInfoProps) {
  // Проверяем, является ли элемент треком (у альбомов нет поля lyrics)
  const hasLyrics = 'lyrics' in track && track.lyrics && track.lyrics.trim().length > 0;

  return (
    <div className={styles.trackInfo}>
      <div className={styles.textSection}>
        <h2 className={styles.trackTitle}>{track.title}</h2>
        <p className={styles.trackArtist}>{track.artist}</p>
      </div>

      <div className={styles.actions}>
        {hasLyrics && (
          <button
            className={styles.lyricsButton}
            onClick={onLyricsClick}
            aria-label="Показать текст песни"
          >
            Тт
          </button>
        )}

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
    </div>
  );
}
