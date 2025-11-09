'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './style.module.scss';

interface NavItem {
  title: string;
  href: string;
  imageSrc: string;
}

const navItems: NavItem[] = [
  { title: 'Треки', href: '/tracks', imageSrc: '/assets/linked/Treki.svg' },
  { title: 'Концерты', href: '/concerts', imageSrc: '/assets/linked/Concerts.svg' },
  { title: 'Мерч', href: '/shop', imageSrc: '/assets/linked/Merch.svg' },
];

export function NavMenu() {
  const [isDesktop, setIsDesktop] = useState(false);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 768 && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const MAX = 5;
    const SCALE = 1.1;

    const handlers = itemRefs.current.map((item, index) => {
      if (!item) return null;

      const img = item.querySelector('img');
      if (!img) return null;

      let raf: number | null = null;
      let tx = 0;
      let ty = 0;

      const onMove = (e: MouseEvent) => {
        const r = item.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);

        tx = Math.max(-1, Math.min(1, nx)) * MAX;
        ty = Math.max(-1, Math.min(1, ny)) * MAX;

        if (!raf) raf = requestAnimationFrame(apply);
      };

      const apply = () => {
        raf = null;
        img.style.transform = `translate(${tx}px, ${ty}px) scale(${SCALE})`;
      };

      const reset = () => {
        img.style.transform = '';
      };

      const onFocusIn = () => {
        img.style.transform = `scale(${SCALE})`;
      };

      item.addEventListener('mousemove', onMove as EventListener);
      item.addEventListener('mouseleave', reset);
      item.addEventListener('focusin', onFocusIn);
      item.addEventListener('focusout', reset);

      return { item, onMove, reset, onFocusIn };
    });

    return () => {
      handlers.forEach((handler) => {
        if (!handler) return;
        handler.item.removeEventListener('mousemove', handler.onMove as EventListener);
        handler.item.removeEventListener('mouseleave', handler.reset);
        handler.item.removeEventListener('focusin', handler.onFocusIn);
        handler.item.removeEventListener('focusout', handler.reset);
      });
    };
  }, [isDesktop]);

  return (
    <nav className={styles.navMenu} aria-label="Разделы">
      <ol className={styles.nav}>
        {navItems.map((item, index) => (
          <li key={item.href} className={styles.navMenuItem}>
            <Link
              href={item.href}
              className={styles.navLink}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
            >
              <img
                className={styles.navLabel}
                src={item.imageSrc}
                alt={item.title}
              />
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
