'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductPage } from '@/features/shop';
import { useData } from '@/contexts/DataContext';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { data, loading } = useData();

  const product = data?.products.find((p) => p.slug === slug);

  useEffect(() => {
    document.body.classList.add('page-scrollable');
    return () => {
      document.body.classList.remove('page-scrollable');
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#000',
          color: '#fff',
        }}
      >
        Загрузка...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#000',
          color: '#fff',
          gap: '16px',
        }}
      >
        <p>Товар не найден</p>
        <button
          onClick={() => router.push('/shop')}
          style={{
            padding: '12px 24px',
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Вернуться в магазин
        </button>
      </div>
    );
  }

  return (
    <ProductPage
      product={product}
      allProducts={data?.products || []}
      onClose={handleClose}
    />
  );
}
