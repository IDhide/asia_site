'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './style.module.scss';

interface BackgroundParallaxProps {
  isBlurred?: boolean;
}

export function BackgroundParallax({ isBlurred = false }: BackgroundParallaxProps) {
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Определяем мобильное устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isMobile) {
      // На мобиле: реагируем на скролл
      const handleScroll = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        
        rafRef.current = requestAnimationFrame(() => {
          if (overlayRef.current) {
            const scrollOffset = window.scrollY * 0.03;
            overlayRef.current.style.transform = `translateY(${scrollOffset}px)`;
          }
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    } else {
      // На десктопе: реагируем на движение мыши
      const handleMouseMove = (e: MouseEvent) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        
        rafRef.current = requestAnimationFrame(() => {
          if (overlayRef.current) {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            const moveX = x * 15;
            const moveY = y * 15;
            overlayRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
          }
        });
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [isMobile]);

  return (
    <div className={`${styles.background} ${isBlurred ? styles.blurred : ''}`}>
      {/* Основная картинка */}
      <div className={styles.mainImage}>
        <Image
          src="/assets/main/bg_main.png"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover' }}
          quality={90}
          sizes="100vw"
        />
      </div>

      {/* Оверлей с параллакс-эффектом */}
      <div
        ref={overlayRef}
        className={styles.overlayImage}
      >
        <Image
          src="/assets/main/bg_overlay.png"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover' }}
          quality={90}
          sizes="100vw"
        />
      </div>
    </div>
  );
}
