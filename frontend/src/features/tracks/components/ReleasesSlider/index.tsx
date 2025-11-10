'use client';

import { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import type { SliderItem } from '@/types/track';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import styles from './style.module.scss';

interface ReleasesSliderProps {
  tracks: SliderItem[];
  onSlideChange?: (index: number) => void;
  onSlideClick?: () => void;
}

export function ReleasesSlider({ tracks, onSlideChange, onSlideClick }: ReleasesSliderProps) {
  const swiperRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { getMediaUrl } = useMediaUrl();

  useEffect(() => {
    if (tracks.length === 0) return;

    const loadSwiper = async () => {
      const Swiper = (await import('swiper')).default;
      const { EffectCoverflow, Keyboard, Mousewheel } = await import('swiper/modules');

      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }

      if (swiperRef.current) {
        let lastSlideTime = 0;
        let targetIndex = 0;
        
        const swiperInstance = new Swiper(swiperRef.current, {
          modules: [EffectCoverflow, Keyboard, Mousewheel],
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          slidesPerGroup: 1,
          loop: false,
          speed: 520,
          initialSlide: 0,
          resistanceRatio: 0.85,
          allowTouchMove: true,
          // Настройки свайпа
          shortSwipes: true,
          longSwipes: true,
          longSwipesRatio: 0.25,
          longSwipesMs: 200,
          threshold: 5,
          touchRatio: 1,
          touchAngle: 45,
          followFinger: true,
          preventInteractionOnTransition: true,
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
            scale: 0.8,
          },
          keyboard: {
            enabled: true,
            pageUpDown: false,
          },
          mousewheel: {
            enabled: true,
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
            thresholdDelta: 30,
            thresholdTime: 200,
          },
          on: {
            touchStart: (swiper) => {
              targetIndex = swiper.activeIndex;
            },
            slideChangeTransitionStart: (swiper) => {
              const now = Date.now();
              const timeSinceLastSlide = now - lastSlideTime;
              
              // Если прошло меньше 400мс с последнего переключения - отменяем
              if (timeSinceLastSlide < 400 && lastSlideTime > 0) {
                swiper.slideTo(targetIndex, 0);
                return;
              }
              
              const currentIdx = swiper.activeIndex;
              const diff = currentIdx - targetIndex;
              
              // Разрешаем только переход на +1 или -1
              if (Math.abs(diff) > 1) {
                const newTarget = targetIndex + (diff > 0 ? 1 : -1);
                swiper.slideTo(newTarget, 520);
                targetIndex = newTarget;
              } else {
                targetIndex = currentIdx;
              }
              
              lastSlideTime = now;
            },
            slideChange: (swiper) => {
              setCurrentIndex(swiper.activeIndex);
              onSlideChange?.(swiper.activeIndex);
            },
            init: (swiper) => {
              setCurrentIndex(0);
              onSlideChange?.(0);
              targetIndex = 0;
            },
          },
        });

        swiperInstanceRef.current = swiperInstance;
      }
    };

    loadSwiper();

    return () => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    };
  }, [tracks, onSlideChange]);

  const handlePrevClick = () => {
    swiperInstanceRef.current?.slidePrev();
  };

  const handleNextClick = () => {
    swiperInstanceRef.current?.slideNext();
  };

  if (tracks.length === 0) {
    return (
      <div className={styles.releasesSlider}>
        <div className={styles.emptyState}>Нет доступных элементов</div>
      </div>
    );
  }

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === tracks.length - 1;

  return (
    <div className={styles.releasesSlider}>
      {/* Навигационная зона слева - только если не первый слайд */}
      {!isFirstSlide && (
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
      )}

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

      {/* Навигационная зона справа - только если не последний слайд */}
      {!isLastSlide && (
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
      )}
    </div>
  );
}
