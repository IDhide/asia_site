'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import { TrackInfo } from '@/features/tracks';
import styles from './style.module.scss';

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getMediaUrl } = useMediaUrl();
  const { data, loading } = useData();

  useEffect(() => {
    // Enable scrolling
    document.body.classList.add('page-scrollable');
    return () => {
      document.body.classList.remove('page-scrollable');
    };
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  // Находим трек по slug из контекста
  const track = data?.tracks.find(t => t.slug === params.slug);

  if (!track) {
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
    <div className={`${styles.trackDetailPage} detail-page-no-scroll`}>
      <div className="container-medium">
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
    </div>
  );
}
