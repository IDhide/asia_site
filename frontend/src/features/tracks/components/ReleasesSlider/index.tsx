'use client';

import { useEffect, useRef } from 'react';
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
  const { getMediaUrl } = useMediaUrl();

  useEffect(() => {
    const loadSwiper = async () => {
      const Swiper = (await import('swiper')).default;
      const { EffectCoverflow, Keyboard } = await import('swiper/modules');

      if (swiperRef.current) {
        new Swiper(swiperRef.current, {
          modules: [EffectCoverflow, Keyboard],
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          loop: tracks.length > 3,
          speed: 520,
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
          on: {
            slideChange: (swiper) => {
              if (onSlideChange) {
                onSlideChange(swiper.realIndex);
              }
            },
          },
        });
      }
    };

    loadSwiper();
  }, [tracks.length, onSlideChange]);

  return (
    <div className={styles.releasesSlider}>
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
    </div>
  );
}
