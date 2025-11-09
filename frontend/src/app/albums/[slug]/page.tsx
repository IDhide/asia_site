'use client';

import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
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

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getMediaUrl } = useMediaUrl();
  const { data, loading } = useData();

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
        {/* Левая колонка: обложка и инфо */}
        <div className={styles.coverSection}>
          <div className={styles.coverWrapper}>
            <img
              src={album.cover ? getMediaUrl(album.cover) : '/assets/placeholder.png'}
              alt={album.title}
            />
          </div>

          <div className={styles.albumInfo}>
            <h1 className={styles.title}>{album.title}</h1>
            <p className={styles.artist}>{album.artist}</p>
            {album.year && <p className={styles.year}>{album.year}</p>}
            {album.description && (
              <p className={styles.description}>{album.description}</p>
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
