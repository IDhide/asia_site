'use client';

import Link from 'next/link';
import styles from './style.module.scss';

const navItems = [
  { title: 'Треки', href: '/tracks', imageSrc: '/assets/linked/Treki.svg' },
  { title: 'Концерты', href: '/concerts', imageSrc: '/assets/linked/Concerts.svg' },
  { title: 'Мерч', href: '/shop', imageSrc: '/assets/linked/Merch.svg' },
];

export function NavMenu() {
  return (
    <nav className={styles.navMenu} aria-label="Разделы">
      <ul className={styles.nav}>
        {navItems.map((item) => (
          <li key={item.href} className={styles.navMenuItem}>
            <Link href={item.href} className={styles.navLink}>
              <img
                className={styles.navLabel}
                src={item.imageSrc}
                alt={item.title}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
