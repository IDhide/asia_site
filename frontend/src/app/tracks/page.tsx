'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import styles from './style.module.scss';
import { ReleasesSlider } from '@/features/tracks/components/ReleasesSlider';
import { TrackInfo } from '@/features/tracks/components/TrackInfo';


type ViewMode = 'tracks' | 'albums';

export default function TracksPage() {
  const router = useRouter();
  const { data, loading } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('tracks');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Поднимаем страницу над блюром хедера
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('page-content-above-blur');
      main.classList.remove('page-content');
    }
    return () => {
      const main = document.querySelector('main');
      if (main) {
        main.classList.remove('page-content-above-blur');
        main.classList.add('page-content');
      }
    };
  }, []);

  // Сбрасываем индекс при смене режима просмотра
  useEffect(() => {
    setCurrentIndex(0);
  }, [viewMode]);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  const tracks = data?.tracks || [];
  const albums = data?.albums || [];

  const displayItems = viewMode === 'tracks' ? tracks : albums;
  const currentItem = displayItems[currentIndex] || displayItems[0];

  const handleItemClick = () => {
    if (!currentItem) return;

    if (viewMode === 'tracks') {
      router.push(`/tracks/${currentItem.slug}`);
    } else {
      router.push(`/albums/${currentItem.slug}`);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className={styles.tracksPage}>
      {/* Переключатель треки/альбомы */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleButton} ${viewMode === 'tracks' ? styles.active : ''}`}
          onClick={() => handleViewModeChange('tracks')}
        >
          ТРЕКИ
        </button>
        <button
          className={`${styles.toggleButton} ${viewMode === 'albums' ? styles.active : ''}`}
          onClick={() => handleViewModeChange('albums')}
        >
          АЛЬБОМЫ
        </button>
      </div>

      {/* Слайдер с обложками */}
      <div className={styles.sliderWrapper}>
        <ReleasesSlider
          key={viewMode}
          tracks={displayItems}
          onSlideChange={setCurrentIndex}
          onSlideClick={handleItemClick}
        />
      </div>

      {/* Информация о треке/альбоме и кнопки */}
      <div className={styles.trackInfoWrapper}>
        {currentItem && (
          <TrackInfo
            track={currentItem}
            onLyricsClick={handleItemClick}
          />
        )}
      </div>
    </div>


  );
}
