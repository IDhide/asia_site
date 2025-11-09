'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/features/cart/hooks/useCart';
import styles from './style.module.scss';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Очищаем корзину при загрузке страницы успеха
    clearCart();
  }, [clearCart]);

  return (
    <div className={styles.success}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.successTitle}>Заказ оформлен!</h1>
        <p className={styles.successText}>
          Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время для подтверждения.
        </p>
        <div className={styles.successActions}>
          <Link href="/" className={styles.homeLink}>
            На главную
          </Link>
          <Link href="/shop" className={styles.shopLink}>
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
}
