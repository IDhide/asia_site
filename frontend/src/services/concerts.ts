import { apiClient } from './api';
import type { Concert } from '@/types/concert';

/**
 * Получить список всех активных концертов
 */
export async function getConcerts(): Promise<Concert[]> {
  return apiClient.get<Concert[]>('/api/concerts/');
}

/**
 * Получить концерт по ID
 */
export async function getConcert(id: number): Promise<Concert> {
  return apiClient.get<Concert>(`/api/concerts/${id}/`);
}
