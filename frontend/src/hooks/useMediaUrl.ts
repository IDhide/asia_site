import { MEDIA_BASE_URL } from '@/utils/constants';

/**
 * Хук для построения полного URL медиафайла
 */
export function useMediaUrl() {
  /**
   * Получить полный URL для медиафайла
   */
  const getMediaUrl = (path: string | null | undefined): string => {
    if (!path) return '';

    // Если путь уже полный URL, вернуть как есть
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Убрать начальный слеш если есть
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Собрать полный URL
    return `${MEDIA_BASE_URL}/${cleanPath}`;
  };

  return { getMediaUrl };
}
