import { apiClient } from './api';
import type { Track } from '@/types/track';

/**
 * Получить список всех треков
 */
export async function getTracks(): Promise<Track[]> {
  return apiClient.get<Track[]>('/api/tracks/');
}

/**
 * Получить трек по ID
 */
export async function getTrack(id: number): Promise<Track> {
  return apiClient.get<Track>(`/api/tracks/${id}/`);
}
