'use client';

import type { SliderItem } from '@/types/track';
import styles from './style.module.scss';

interface TrackInfoProps {
  track?: SliderItem | null;
  onLyricsClick: () => void;
}

const SOCIAL_LINKS = [
  { name: 'YouTube Music', icon: '/assets/tracks_icons/yt_music.svg', url: '#' },
  { name: 'Spotify', icon: '/assets/tracks_icons/spotify.svg', url: '#' },
  { name: 'Apple Music', icon: '/assets/tracks_icons/apple_music.svg', url: '#' },
  { name: 'Сбер Звук', icon: '/assets/tracks_icons/sber_zvuk.svg', url: '#' },
  { name: 'Яндекс Музыка', icon: '/assets/tracks_icons/ya_music.svg', url: '#' },
  { name: 'VK Музыка', icon: '/assets/tracks_icons/vk_music.svg', url: '#' },
];

export function TrackInfo({ track }: TrackInfoProps) {
  // Проверяем, загружаются ли данные (скелетон или нет данных)
  const isLoading = !track || String(track.id).startsWith('skeleton-');

  return (
    <div className={styles.trackInfo}>
      <div className={styles.header}>
        <div className={styles.textSection}>
          {isLoading ? (
            <>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonArtist} />
            </>
          ) : (
            <>
              <h3 className={styles.trackTitle}>{track.title || 'Без названия'}</h3>
              <p className={styles.trackArtist}>{track.artist || 'Неизвестный исполнитель'}</p>
            </>
          )}
        </div>

        <div className={styles.rightSection}>
          {isLoading ? (
            <div className={styles.skeletonYear} />
          ) : (
            track.year && <span className={styles.year}>{track.year}</span>
          )}
        </div>
      </div>

      <div className={styles.socialButtons}>
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.name}
            href={social.url}
            className={styles.socialButton}
            data-service={social.name.toLowerCase().replace(/\s+/g, '-')}
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
