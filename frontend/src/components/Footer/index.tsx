'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SocialDock } from '@/components/SocialDock';
import GradualBlur from '@/components/GradualBlur';
import styles from './style.module.scss';

export function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const toggleDock = () => {
    setIsOpen(!isOpen);
  };

  const closeDock = () => {
    setIsOpen(false);
  };

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        closeDock();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDock();
        anchorRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      <GradualBlur
        target="page"
        position="bottom"
        height="clamp(2.8rem, 7vh, 4.9rem)"
        strength={2.5}
        divCount={8}
        curve="ease-out"
        exponential={true}
        opacity={1}
        zIndex={1}
      />
      <footer className={`${styles.siteFooter} ${isHomePage ? styles.homePage : ''}`} role="contentinfo">
        <div className={styles.footerContent}>
        <button
          ref={anchorRef}
          type="button"
          className={`${styles.socialMedia} ${isOpen ? 'is-open' : ''}`}
          onClick={toggleDock}
          aria-label="Соцсети"
          aria-expanded={isOpen}
        >
          <img src="/assets/main/link.svg" alt="" />
          <SocialDock />
        </button>
        <Link href="/contacts" className={styles.contacts}>
          контакты
        </Link>
        <Link href="/faq" className={styles.faq} aria-label="FAQ">
          <img src="/assets/main/FAQ.svg" alt="FAQ" />
        </Link>
      </div>
    </footer>
    </>
  );
}
