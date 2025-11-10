import { useState, useEffect, useCallback } from 'react';

/**
 * Хук для работы с localStorage с поддержкой SSR и синхронизацией
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Функция для получения значения из localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // State для хранения значения
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Функция для сохранения значения
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Используем функциональное обновление для получения актуального значения
      setStoredValue((currentValue) => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;

        // Сохранить в localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Диспатчим кастомное событие асинхронно для избежания проблем с setState во время рендера
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('local-storage', { detail: { key, value: valueToStore } }));
          }, 0);
        }

        return valueToStore;
      });
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key]);

  // Синхронизация при изменении в других компонентах или вкладках
  useEffect(() => {
    // Обработчик для storage event (между вкладками)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage event for ${key}:`, error);
        }
      }
    };

    // Обработчик для кастомного события (внутри вкладки)
    const handleLocalStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleLocalStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
