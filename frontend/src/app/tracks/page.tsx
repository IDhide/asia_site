'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { ReleasesSlider } from '@/features/tracks/components/ReleasesSlider';
import { TrackInfo } from '@/features/tracks/components/TrackInfo';
import styles from './style.module.scss';

type ViewMode = 'tracks' | 'albums';

export default function TracksPage() {
  const router = useRouter();
  const { data, loading } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('tracks');
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  const tracks = data?.tracks || [];
  const albums = data?.albums || [];

  const displayItems = viewMode === 'tracks' ? tracks : albums;
  const currentItem = displayItems[currentIndex];

  const handleItemClick = () => {
    if (!currentItem) return;

    if (viewMode === 'tracks') {
      router.push(`/tracks/${currentItem.slug}`);
    } else {
      router.push(`/albums/${currentItem.slug}`);
    }
  };

  return (
    <div className={styles.tracksPage}>
      {/* Переключатель треки/альбомы */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleButton} ${viewMode === 'tracks' ? styles.active : ''}`}
          onClick={() => setViewMode('tracks')}
        >
          ТРЕКИ
        </button>
        <button
          className={`${styles.toggleButton} ${viewMode === 'albums' ? styles.active : ''}`}
          onClick={() => setViewMode('albums')}
        >
          АЛЬБОМЫ
        </button>
      </div>

      {/* Слайдер с обложками */}
      <div className={styles.sliderWrapper}>
        <ReleasesSlider
          tracks={displayItems}
          onSlideChange={setCurrentIndex}
          onSlideClick={handleItemClick}
        />
      </div>

      {/* Информация о треке/альбоме и кнопки */}
      {currentItem && (
        <TrackInfo
          track={currentItem}
          onLyricsClick={handleItemClick}
        />
      )}
    </div>
  );
}
