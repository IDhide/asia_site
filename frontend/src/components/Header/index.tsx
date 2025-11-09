'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useCart } from '@/features/cart/hooks/useCart';
import styles from './style.module.scss';

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const getPageImage = (path: string): string | null => {
    if (path.startsWith('/tracks')) return '/assets/linked/Treki.svg';
    if (path.startsWith('/concerts')) return '/assets/linked/Concerts.svg';
    if (path.startsWith('/shop')) return '/assets/linked/Merch.svg';
    return null;
  };

  const currentPageImage = getPageImage(pathname);

  return (
    <header className={styles.siteHeader}>
      <nav className={styles.siteNav} aria-label="Главная навигация">
        {/* Логотип */}
        <Link href="/" className={styles.brand}>
          <Image
            src="/assets/main/logo.svg"
            alt="Асия"
            width={120}
            height={40}
            priority
            className={styles.iconBrand}
          />
        </Link>

        {/* Правая группа элементов */}
        <div className={styles.rightGroup}>
          {/* Навигационное меню (для страниц кроме главной) */}
          {pathname !== '/' && currentPageImage && (
            <div className={styles.navGroup}>
              <button
                className={styles.menuToggle}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label="Открыть меню"
                type="button"
              >
                <img src={currentPageImage} alt="Текущая страница" className={styles.currentPageImage} />
                <svg className={styles.caret} width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {menuOpen && (
                <div className={styles.dropdown}>
                  <ul role="menu">
                    <li role="none">
                      <Link href="/tracks" onClick={() => setMenuOpen(false)} role="menuitem">
                        <img src="/assets/linked/Treki.svg" alt="Треки" />
                      </Link>
                    </li>
                    <li role="none">
                      <Link href="/shop" onClick={() => setMenuOpen(false)} role="menuitem">
                        <img src="/assets/linked/Merch.svg" alt="Мерч" />
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Действия */}
          <AudioPlayer />
          {itemCount > 0 && (
            <Link href="/cart" className={styles.cartIcon} aria-label={`Корзина (${itemCount})`}>
              🛒
              <span className={styles.badge}>{itemCount}</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
