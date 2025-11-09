'use client';

import { useEffect } from 'react';
import { ProductsGrid } from '@/features/shop';
import { useData } from '@/contexts/DataContext';
import styles from './style.module.scss';

export default function ShopPage() {
  const { data, loading } = useData();

  useEffect(() => {
    document.body.classList.add('page-scrollable');
    return () => {
      document.body.classList.remove('page-scrollable');
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.shopPage}>
      <ProductsGrid products={data?.products || []} />
    </div>
  );
}
