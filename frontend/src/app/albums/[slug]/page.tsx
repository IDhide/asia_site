'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import { TrackInfo } from '@/features/tracks';
import styles from './style.module.scss';

export default function AlbumDetailPage() {
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

  // Находим альбом по slug из контекста
  const album = data?.albums.find(a => a.slug === params.slug);

  if (!album) {
    return (
      <div className={styles.error}>
        <h1>Альбом не найден</h1>
        <p>Slug: {params.slug}</p>
        <button onClick={() => router.push('/tracks')}>
          Вернуться к трекам
        </button>
      </div>
    );
  }

  // Получаем треки этого альбома из контекста
  const albumTracks = data?.tracks.filter(t => t.album?.id === album.id) || [];

  return (
    <div className={styles.albumDetailPage}>
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Назад
      </button>

      <div className={styles.contentGrid}>
        {/* Левая колонка: обложка */}
        <div className={styles.coverSection}>
          <div className={styles.coverWrapper}>
            <img
              src={album.cover ? getMediaUrl(album.cover) : '/assets/placeholder.png'}
              alt={album.title}
            />
          </div>

          {album.description && (
            <p className={styles.description}>{album.description}</p>
          )}

          <TrackInfo
            track={album}
            onLyricsClick={() => {
              const tracksSection = document.querySelector(`.${styles.tracksSection}`);
              tracksSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Правая колонка: список треков */}
        <div className={styles.tracksSection}>
          <h2 className={styles.tracksTitle}>
            Треки ({albumTracks.length})
          </h2>

          {albumTracks.length > 0 ? (
            <div className={styles.tracksList}>
              {albumTracks.map((track, index) => (
                <div key={track.id} className={styles.trackItem}>
                  <div className={styles.trackNumber}>{track.order || index + 1}</div>

                  <div className={styles.trackCover}>
                    <img
                      src={track.cover ? getMediaUrl(track.cover) : album.cover ? getMediaUrl(album.cover) : '/assets/placeholder.png'}
                      alt={track.title}
                    />
                  </div>

                  <div className={styles.trackInfo}>
                    <button
                      className={styles.trackTitle}
                      onClick={() => router.push(`/tracks/${track.slug}`)}
                    >
                      {track.title}
                    </button>
                    <p className={styles.trackArtist}>{track.artist}</p>
                  </div>

                  {track.audio && (
                    <audio
                      controls
                      className={styles.audioPlayer}
                      preload="none"
                    >
                      <source src={getMediaUrl(track.audio)} type="audio/mpeg" />
                      Ваш браузер не поддерживает аудио.
                    </audio>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noTracks}>В альбоме пока нет треков</p>
          )}
        </div>
      </div>
    </div>
  );
}
