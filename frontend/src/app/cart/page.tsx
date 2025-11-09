'use client';

import Link from 'next/link';
import { useCart } from '@/features/cart/hooks/useCart';
import { CartList } from '@/features/cart/components/CartList';
import { CheckoutForm } from '@/features/cart/components/CheckoutForm';
import styles from './style.module.scss';

export default function CartPage() {
  const { items, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className={styles.emptyCart}>
        <h1 className={styles.emptyTitle}>Корзина пуста</h1>
        <p className={styles.emptyText}>
          Добавьте товары из магазина, чтобы оформить заказ
        </p>
        <Link href="/shop" className={styles.shopLink}>
          Перейти в магазин
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <h1 className={styles.pageTitle}>Корзина</h1>
      <div className={styles.cartLayout}>
        <CartList />
        <CheckoutForm />
      </div>
    </div>
  );
}
