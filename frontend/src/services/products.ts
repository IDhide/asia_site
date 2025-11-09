import { apiClient } from './api';
import type { Product, ProductDetail } from '@/types/product';

/**
 * Получить список всех активных товаров
 */
export async function getProducts(): Promise<Product[]> {
  return apiClient.get<Product[]>('/api/products/');
}

/**
 * Получить детали товара по slug
 */
export async function getProduct(slug: string): Promise<ProductDetail> {
  return apiClient.get<ProductDetail>(`/api/products/${slug}/`);
}
