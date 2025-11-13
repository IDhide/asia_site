'use client';

import Link from 'next/link';
import { useCart } from '@/features/cart/hooks/useCart';
import { CartItem } from '../CartItem';
import styles from './style.module.scss';

export function CartList() {
  const { items } = useCart();

  // Создаем массив из 2 слотов
  const slots = [0, 1];

  return (
    <div className={styles.cartList}>
      <div className={styles.itemsHeader}>
        <span className={styles.itemsCount}>ВЫБРАНО: {items.length} ШТ.</span>
      </div>

      <div className={styles.items}>
        {slots.map((slotIndex) => {
          const item = items[slotIndex];
          
          if (item) {
            return <CartItem key={item.product.id} item={item} />;
          }
          
          return (
            <Link 
              key={`placeholder-${slotIndex}`} 
              href="/shop" 
              className={styles.placeholder}
            >
              <div className={styles.placeholderIcon}>+</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
