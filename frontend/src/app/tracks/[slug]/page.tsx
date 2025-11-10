'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Track } from '@/types/track';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import { TrackInfo } from '@/features/tracks';
import styles from './style.module.scss';

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getMediaUrl } = useMediaUrl();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Enable scrolling
    document.body.classList.add('page-scrollable');
    return () => {
      document.body.classList.remove('page-scrollable');
    };
  }, []);

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
        {/* Левая колонка: обложка */}
        <div className={styles.coverSection}>
          <div className={styles.coverWrapper}>
            <img
              src={track.cover ? getMediaUrl(track.cover) : '/assets/placeholder.png'}
              alt={track.title}
            />
          </div>

          <TrackInfo
            track={track}
            onLyricsClick={() => {
              const lyricsSection = document.querySelector(`.${styles.lyricsSection}`);
              lyricsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
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
