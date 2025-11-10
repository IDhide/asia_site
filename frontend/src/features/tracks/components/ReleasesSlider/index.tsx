'use client';

import { useEffect, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import type { SliderItem } from '@/types/track';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/mousewheel';
import styles from './style.module.scss';

interface ReleasesSliderProps {
  tracks: SliderItem[];
  onSlideChange?: (index: number) => void;
  onSlideClick?: () => void;
}

export function ReleasesSlider({ tracks, onSlideChange, onSlideClick }: ReleasesSliderProps) {
  const swiperRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<SwiperType | null>(null);
  const { getMediaUrl } = useMediaUrl();

  useEffect(() => {
    if (tracks.length === 0) return;

    const loadSwiper = async () => {
      const Swiper = (await import('swiper')).default;
      const { EffectCoverflow, Keyboard, Mousewheel } = await import('swiper/modules');

      // Уничтожаем предыдущий экземпляр если есть
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }

      if (swiperRef.current) {
        const swiperInstance = new Swiper(swiperRef.current, {
          modules: [EffectCoverflow, Keyboard, Mousewheel],
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          loop: false, // Отключаем loop для корректной работы прокрутки
          speed: 520,
          initialSlide: 0,
          resistanceRatio: 0.85, // Сопротивление на краях
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
          },
          keyboard: {
            enabled: true,
          },
          mousewheel: {
            enabled: true,
            forceToAxis: true,
            sensitivity: 1,
            thresholdDelta: 50,
            thresholdTime: 300,
          },
          on: {
            slideChange: (swiper) => {
              if (onSlideChange) {
                onSlideChange(swiper.activeIndex);
              }
            },
            init: (swiper) => {
              // Вызываем onSlideChange при инициализации
              if (onSlideChange) {
                onSlideChange(0);
              }
            },
          },
        });

        swiperInstanceRef.current = swiperInstance;
      }
    };

    loadSwiper();

    // Cleanup при размонтировании
    return () => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    };
  }, [tracks, onSlideChange]);

  const handlePrevClick = () => {
    if (swiperInstanceRef.current) {
      swiperInstanceRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperInstanceRef.current) {
      swiperInstanceRef.current.slideNext();
    }
  };

  if (tracks.length === 0) {
    return (
      <div className={styles.releasesSlider}>
        <div className={styles.emptyState}>Нет доступных элементов</div>
      </div>
    );
  }

  return (
    <div className={styles.releasesSlider}>
      {/* Навигационная зона слева */}
      <div
        className={`${styles.navZone} ${styles.navZoneLeft}`}
        onClick={handlePrevClick}
        role="button"
        aria-label="Предыдущий"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePrevClick();
          }
        }}
      />

      <div className={styles.swiper} ref={swiperRef}>
        <div className="swiper-wrapper">
          {tracks.map((track) => (
            <div key={track.id} className="swiper-slide">
              <div
                className={styles.slideInner}
                onClick={onSlideClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSlideClick?.();
                  }
                }}
              >
                <img
                  src={track.cover ? getMediaUrl(track.cover) : '/assets/placeholder.png'}
                  alt={track.title}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Навигационная зона справа */}
      <div
        className={`${styles.navZone} ${styles.navZoneRight}`}
        onClick={handleNextClick}
        role="button"
        aria-label="Следующий"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleNextClick();
          }
        }}
      />
    </div>
  );
}
