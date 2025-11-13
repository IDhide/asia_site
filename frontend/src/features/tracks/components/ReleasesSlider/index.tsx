'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { SliderItem } from '@/types/track';
import { useMediaUrl } from '@/hooks/useMediaUrl';
import styles from './style.module.scss';

// ============================================================================
// НАСТРОЙКИ 3D COVERFLOW СЛАЙДЕРА
// ============================================================================

// 3D эффект (Apple Cover Flow стиль)
const COVERFLOW_CONFIG = {
  rotateY: 110,           // Угол поворота обложек по оси Y (градусы) - как у Apple
  translateZ: 550,       // Глубина 3D пространства (px) - боковые обложки уходят назад
  translateX: 80,       // Горизонтальное расстояние между обложками (px)
  scaleMin: 0.75,        // Минимальный масштаб дальних обложек
  scaleStep: 0.1,        // Шаг уменьшения масштаба
  opacityMin: 0.1,       // Минимальная прозрачность дальних обложек
  opacityStep: 0.25,     // Шаг уменьшения прозрачности
  rotateYMax: 70,        // Максимальный угол поворота (градусы)
};

// Чувствительность управления
const SENSITIVITY_CONFIG = {
  drag: 0.006,           // Чувствительность драга мышью/тачем
  wheel: 0.005,          // Чувствительность колеса мыши/тачпада
  wheelInvert: true,     // Инвертировать направление скролла (true для естественного скролла на Mac)
};

// Физика и анимация
const PHYSICS_CONFIG = {
  friction: 0.92,        // Коэффициент затухания инерции (0-1, меньше = быстрее останавливается)
  snapSpeed: 0.15,       // Скорость притягивания к ближайшему слайду (0-1)
  snapThreshold: 0.01,   // Порог для завершения snap анимации
  velocityThreshold: 0.001, // Минимальная скорость для продолжения инерции
};

// Предзагрузка изображений
const PRELOAD_CONFIG = {
  initial: 5,            // Количество изображений для начальной загрузки
  range: 3,              // Количество изображений до/после текущего для предзагрузки
};

// ============================================================================

interface ReleasesSliderProps {
  tracks: SliderItem[];
  onSlideChange?: (index: number) => void;
  onSlideClick?: () => void;
}

export function ReleasesSlider({ tracks, onSlideChange, onSlideClick }: ReleasesSliderProps) {
  // Фолбек: показываем 5 скелетонов если нет данных
  const displayTracks = tracks.length > 0 
    ? tracks 
    : Array.from({ length: 5 }, (_, i) => ({
        id: `skeleton-${i}`,
        slug: '',
        title: 'Загрузка...',
        cover: null,
      }));

  const isLoading = tracks.length === 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(
    new Set(Array.from({ length: PRELOAD_CONFIG.initial }, (_, i) => i))
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const velocityRef = useRef(0);
  const lastPosRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const { getMediaUrl } = useMediaUrl();

  // Предзагрузка изображений рядом с текущим
  useEffect(() => {
    if (displayTracks.length === 0) return;

    setLoadedImages((prev) => {
      const toLoad = new Set(prev);
      const range = PRELOAD_CONFIG.range;
      for (let i = Math.max(0, currentIndex - range); i <= Math.min(displayTracks.length - 1, currentIndex + range); i++) {
        toLoad.add(i);
      }
      return toLoad;
    });
  }, [currentIndex, displayTracks.length]);

  // Вычисление 3D трансформаций для каждого слайда (Apple Cover Flow стиль)
  const getSlideTransform = useCallback((index: number, progress: number) => {
    const offset = index - progress;
    const absOffset = Math.abs(offset);
    
    // Apple Cover Flow эффект:
    // Обложки поворачиваются вокруг центральной оси, создавая эффект "веера"
    // Порядок трансформаций КРИТИЧЕСКИ ВАЖЕН (применяются справа налево):
    // 1. translateX - сначала смещаем по горизонтали
    // 2. rotateY - затем поворачиваем (создает веер)
    // 3. translateZ - отодвигаем боковые обложки назад
    // Инвертируем translateX и rotateY для естественного направления (первая карточка слева)
    const rotateY = Math.max(-COVERFLOW_CONFIG.rotateYMax, Math.min(COVERFLOW_CONFIG.rotateYMax, -offset * COVERFLOW_CONFIG.rotateY));
    const translateZ = -absOffset * COVERFLOW_CONFIG.translateZ;
    const translateX = -offset * COVERFLOW_CONFIG.translateX;
    const scale = Math.max(COVERFLOW_CONFIG.scaleMin, 1 - absOffset * COVERFLOW_CONFIG.scaleStep);
    const opacity = Math.max(COVERFLOW_CONFIG.opacityMin, 1 - absOffset * COVERFLOW_CONFIG.opacityStep);
    
    return {
      // Порядок: translateZ -> rotateY -> translateX (справа налево!)
      transform: `translateX(${translateX}px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
      opacity,
      zIndex: Math.round(100 - absOffset * 10),
    };
  }, []);

  // Обновление позиций слайдов
  const updateSlides = useCallback(() => {
    if (!containerRef.current) return;

    const slides = containerRef.current.querySelectorAll<HTMLElement>(`.${styles.slide}`);
    slides.forEach((slide, index) => {
      const style = getSlideTransform(index, scrollProgress);
      slide.style.transform = style.transform;
      slide.style.opacity = String(style.opacity);
      slide.style.zIndex = String(style.zIndex);
    });

    const newIndex = Math.round(scrollProgress);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < displayTracks.length) {
      setCurrentIndex(newIndex);
      if (!isLoading) {
        onSlideChange?.(newIndex);
      }
    }
  }, [scrollProgress, currentIndex, displayTracks.length, onSlideChange, getSlideTransform, isLoading]);

  useEffect(() => {
    updateSlides();
  }, [updateSlides]);

  // Инерционное движение
  useEffect(() => {
    if (isDragging) return;

    const animate = () => {
      if (Math.abs(velocityRef.current) > PHYSICS_CONFIG.velocityThreshold) {
        velocityRef.current *= PHYSICS_CONFIG.friction;
        const newProgress = scrollProgress + velocityRef.current;
        const clampedProgress = Math.max(0, Math.min(displayTracks.length - 1, newProgress));
        setScrollProgress(clampedProgress);
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Snap к ближайшему слайду
        const target = Math.round(scrollProgress);
        const diff = target - scrollProgress;
        if (Math.abs(diff) > PHYSICS_CONFIG.snapThreshold) {
          setScrollProgress(scrollProgress + diff * PHYSICS_CONFIG.snapSpeed);
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setScrollProgress(target);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, scrollProgress, displayTracks.length]);

  // Обработка мыши
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLoading) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, scrollLeft: scrollProgress };
    lastPosRef.current = e.clientX;
    velocityRef.current = 0;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isLoading) return;
    
    const deltaX = e.clientX - dragStartRef.current.x;
    const newProgress = dragStartRef.current.scrollLeft - deltaX * SENSITIVITY_CONFIG.drag;
    const clampedProgress = Math.max(0, Math.min(displayTracks.length - 1, newProgress));
    
    velocityRef.current = (lastPosRef.current - e.clientX) * SENSITIVITY_CONFIG.drag;
    lastPosRef.current = e.clientX;
    
    setScrollProgress(clampedProgress);
  }, [isDragging, displayTracks.length, isLoading]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Обработка тач-событий
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLoading) return;
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.touches[0].clientX, scrollLeft: scrollProgress };
    lastPosRef.current = e.touches[0].clientX;
    velocityRef.current = 0;
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || isLoading) return;
    
    // Предотвращаем навигацию браузера
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const newProgress = dragStartRef.current.scrollLeft - deltaX * SENSITIVITY_CONFIG.drag;
    const clampedProgress = Math.max(0, Math.min(displayTracks.length - 1, newProgress));
    
    velocityRef.current = (lastPosRef.current - e.touches[0].clientX) * SENSITIVITY_CONFIG.drag;
    lastPosRef.current = e.touches[0].clientX;
    
    setScrollProgress(clampedProgress);
  }, [isDragging, displayTracks.length, isLoading]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  // Колесо мыши / тачпад
  const handleWheel = (e: React.WheelEvent) => {
    if (isLoading) return;
    
    // Инвертируем направление для естественного скролла (как на Mac)
    const delta = e.deltaY * SENSITIVITY_CONFIG.wheel * (SENSITIVITY_CONFIG.wheelInvert ? -1 : 1);
    const newProgress = scrollProgress + delta;
    const clampedProgress = Math.max(0, Math.min(displayTracks.length - 1, newProgress));
    
    // Предотвращаем навигацию браузера ТОЛЬКО если:
    // 1. Мы не на первом слайде И пытаемся листать назад (влево)
    // 2. Мы не на последнем слайде И пытаемся листать вперед (вправо)
    // При инверсии: положительный deltaY (скролл вниз) = движение влево (назад)
    const scrollingBack = delta < 0; // уменьшаем progress = листаем назад (влево)
    const scrollingForward = delta > 0; // увеличиваем progress = листаем вперед (вправо)
    const isAtStart = scrollProgress <= 0.1;
    const isAtEnd = scrollProgress >= displayTracks.length - 1.1;
    
    const shouldPreventDefault = 
      (scrollingBack && !isAtStart) || 
      (scrollingForward && !isAtEnd);
    
    if (shouldPreventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setScrollProgress(clampedProgress);
    velocityRef.current = delta * 0.3;
  };

  // Клавиатура
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;
      
      if (e.key === 'ArrowLeft') {
        const target = Math.max(0, Math.floor(scrollProgress) - 1);
        setScrollProgress(target);
      } else if (e.key === 'ArrowRight') {
        const target = Math.min(displayTracks.length - 1, Math.ceil(scrollProgress) + 1);
        setScrollProgress(target);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollProgress, displayTracks.length, isLoading]);

  return (
    <div className={styles.releasesSlider}>
      <div
        ref={containerRef}
        className={`${styles.coverflowContainer} ${isLoading ? styles.loading : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onWheel={handleWheel}
      >
        <div className={styles.coverflowStage}>
          {displayTracks.map((track, index) => {
            const shouldLoad = loadedImages.has(index);
            const isActive = Math.round(scrollProgress) === index;

            return (
              <div
                key={track.id}
                className={`${styles.slide} ${isActive ? styles.slideActive : ''} ${isLoading ? styles.slideLoading : ''}`}
                onClick={() => {
                  if (isLoading) return;
                  if (isActive) {
                    onSlideClick?.();
                  } else {
                    setScrollProgress(index);
                  }
                }}
                role="button"
                tabIndex={isLoading ? -1 : 0}
                onKeyDown={(e) => {
                  if (isLoading) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isActive) {
                      onSlideClick?.();
                    } else {
                      setScrollProgress(index);
                    }
                  }
                }}
              >
                <div className={styles.slideInner}>
                  {isLoading ? (
                    <div className={styles.skeletonCover} />
                  ) : shouldLoad ? (
                    <img
                      src={track.cover ? getMediaUrl(track.cover) : '/assets/placeholder.png'}
                      alt={track.title}
                      loading={index < PRELOAD_CONFIG.initial ? 'eager' : 'lazy'}
                      draggable={false}
                    />
                  ) : (
                    <div className={styles.placeholder} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
