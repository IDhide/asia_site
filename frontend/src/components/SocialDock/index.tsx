'use client';

import { SOCIAL_LINKS } from '@/utils/constants';
import styles from './style.module.scss';

const socialItems = [
  { href: SOCIAL_LINKS.telegram, src: '/assets/social_icons/social_telegram.svg', label: 'Telegram' },
  { href: SOCIAL_LINKS.vk, src: '/assets/social_icons/social_vk.svg', label: 'VK' },
  { href: SOCIAL_LINKS.youtube, src: '/assets/social_icons/social_youtube.svg', label: 'YouTube' },
];

export function SocialDock() {
  return (
    <div className={styles.socialDock}>
      {socialItems.map((item, index) => (
        <a
          key={item.label}
          href={item.href}
          className={styles.socialDockBtn}
          aria-label={item.label}
          target="_blank"
          rel="noopener noreferrer"
          style={{ '--delay': `${80 * (index + 1)}ms` } as React.CSSProperties}
        >
          <img src={item.src} alt={item.label} />
        </a>
      ))}
    </div>
  );
}
