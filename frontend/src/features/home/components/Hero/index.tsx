'use client';

import { NavMenu } from '../NavMenu';
import styles from './style.module.scss';

export function Hero() {
  return (
    <div className={styles.hero} role="main" aria-label="Главный экран">
      <div className={styles.heroContent}>
        <NavMenu />
      </div>
    </div>
  );
}
