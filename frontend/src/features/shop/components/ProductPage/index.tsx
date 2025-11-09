'use client';

import { useState } from 'react';
import type { ProductDetail } from '@/types/product';
import { useCart } from '@/features/cart/hooks/useCart';
import { ProductsGrid } from '../ProductsGrid';
import styles from './style.module.scss';

interface ProductPageProps {
  product: ProductDetail;
  allProducts: ProductDetail[];
  onClose: () => void;
}

export function ProductPage({ product, allProducts, onClose }: ProductPageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();

  const images = product.images || [];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('ru-RU')} ₽`;
  };

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const inCart = isInCart(product.id);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.productDetail}>
        {/* Левая часть - фото */}
        <div className={styles.imageSection}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>

          <div className={styles.mainImage}>
            {images.length > 0 ? (
              <img
                src={images[activeIndex].image}
                alt={images[activeIndex].alt_text || product.title}
              />
            ) : (
              <img src={product.cover} alt={product.title} />
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.imageControls}>
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePrevImage}
                aria-label="Предыдущее фото"
              >
                ‹
              </button>
              <button
                type="button"
                className={styles.navButton}
                onClick={handleNextImage}
                aria-label="Следующее фото"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Правая часть - информация */}
        <div className={styles.infoSection}>
          {/* Верхний блок: название, цена, кнопки */}
          <div className={styles.topBlock}>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.buyButton}
                onClick={handleAddToCart}
              >
                КУПИТЬ
              </button>
              {inCart && (
                <button type="button" className={styles.cartBadge}>
                  В КОРЗИНЕ 🛒
                </button>
              )}
            </div>
          </div>

          {/* Нижний блок: описание, размеры, галерея */}
          <div className={styles.bottomBlock}>
            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}

            {/* Размеры */}
            <div className={styles.sizesRow}>
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`${styles.sizeButton} ${selectedSize === size ? styles.active : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Галерея миниатюр */}
            {images.length > 1 && (
              <div className={styles.thumbnailsWrapper}>
                <div className={styles.thumbnails}>
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      className={`${styles.thumbnail} ${index === activeIndex ? styles.active : ''}`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <img
                        src={image.image}
                        alt={image.alt_text || `${product.title} - ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Дополнительная информация */}
            {(product.material || product.delivery_info) && (
              <div className={styles.details}>
                {product.material && <p>Материал: {product.material}</p>}
                {product.delivery_info && <p>{product.delivery_info}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Сетка других товаров */}
      <div className={styles.otherProducts}>
        <ProductsGrid products={allProducts} excludeId={product.id} />
      </div>
    </div>
  );
}
