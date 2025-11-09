'use client';

import type { CartItem as CartItemType } from '@/types/cart';
import { useCart } from '@/features/cart/hooks/useCart';
import styles from './style.module.scss';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart } = useCart();

  const handleRemove = () => {
    removeFromCart(item.product.id);
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemImage}>
        {item.product.cover ? (
          <img src={item.product.cover} alt={item.product.title} />
        ) : (
          <div className={styles.placeholderImage}>🛍️</div>
        )}
      </div>

      <button
        type="button"
        className={styles.removeButton}
        onClick={handleRemove}
        aria-label={`Удалить ${item.product.title} из корзины`}
      >
        ✕
      </button>
    </div>
  );
}
