'use client';

import Link from 'next/link';
import type { ProductDetail } from '@/types/product';
import styles from './style.module.scss';

interface ProductsGridProps {
  products: ProductDetail[];
  excludeId?: number;
}

export function ProductsGrid({ products, excludeId }: ProductsGridProps) {
  const filteredProducts = excludeId
    ? products.filter((p) => p.id !== excludeId)
    : products;

  return (
    <div className={styles.grid}>
      {filteredProducts.map((product) => (
        <Link
          key={product.id}
          href={`/shop/${product.slug}`}
          className={styles.gridItem}
        >
          <img
            src={product.cover}
            alt={product.title}
            className={styles.image}
          />
        </Link>
      ))}
    </div>
  );
}
