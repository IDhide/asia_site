'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Track } from '@/types/track';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import styles from './style.module.scss';

const SOCIAL_LINKS = [
  { name: 'YouTube Music', icon: '/assets/social_icons/social_youtube.svg', url: '#' },
  { name: 'Spotify', icon: '/assets/social_icons/spotify.svg', url: '#' },
  { name: 'Apple Music', icon: '/assets/social_icons/apple-music.svg', url: '#' },
  { name: 'Сбер Звук', icon: '/assets/social_icons/sber.svg', url: '#' },
  { name: 'Яндекс Музыка', icon: '/assets/social_icons/yandex-music.svg', url: '#' },
  { name: 'VK Музыка', icon: '/assets/social_icons/social_vk.svg', url: '#' },
];

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getMediaUrl } = useMediaUrl();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/music/api/tracks/${params.slug}/`);

        if (!response.ok) {
          throw new Error('Трек не найден');
        }

        const data = await response.json();
        setTrack(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchTrack();
    }
  }, [params.slug]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error || !track) {
    return (
      <div className={styles.error}>
        <h1>Трек не найден</h1>
        <button onClick={() => router.push('/tracks')}>
          Вернуться к трекам
        </button>
      </div>
    );
  }

  const hasLyrics = track.lyrics && track.lyrics.trim().length > 0;

  return (
    <div className={styles.trackDetailPage}>
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Назад
      </button>

      <div className={styles.contentGrid}>
        {/* Левая колонка: обложка и инфо */}
        <div className={styles.coverSection}>
          <div className={styles.coverWrapper}>
            <img
              src={track.cover ? getMediaUrl(track.cover) : '/assets/placeholder.png'}
              alt={track.title}
            />
          </div>

          <div className={styles.trackInfo}>
            <h1 className={styles.title}>{track.title}</h1>
            <p className={styles.artist}>{track.artist}</p>
            {track.year && <p className={styles.year}>{track.year}</p>}

            {track.album && (
              <button
                className={styles.albumLink}
                onClick={() => router.push(`/albums/${track.album!.slug}`)}
              >
                Альбом: {track.album.title}
              </button>
            )}
          </div>

          {/* Кнопки соцсетей */}
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

        {/* Правая колонка: текст песни */}
        <div className={styles.lyricsSection}>
          <h2 className={styles.lyricsTitle}>Текст песни</h2>
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
  );
}
