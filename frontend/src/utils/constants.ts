/**
 * Константы приложения
 */

// API URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:8000/media';

// Site URLs
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3010';

// Social Links
export const SOCIAL_LINKS = {
  telegram: '#',
  vk: '#',
  youtube: '#',
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  CART: 'asia_cart',
  FAVORITES: 'asia_favorites',
} as const;

// Pagination
export const ITEMS_PER_PAGE = 12;

// Timeouts
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 3000;
