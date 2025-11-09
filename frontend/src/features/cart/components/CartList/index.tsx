'use client';

import { useCart } from '@/features/cart/hooks/useCart';
import { CartItem } from '../CartItem';
import styles from './style.module.scss';

export function CartList() {
  const { items } = useCart();

  return (
    <div className={styles.cartList}>
      <div className={styles.itemsHeader}>
        <span className={styles.itemsCount}>ВЫБРАНО: {items.length} ШТ.</span>
      </div>

      <div className={styles.items}>
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>
    </div>
  );
}
