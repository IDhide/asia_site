/**
 * API Client для взаимодействия с Django backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Кастомный класс ошибки API
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || statusText);
    this.name = 'ApiError';
  }
}

/**
 * Базовый API клиент
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText,
          `Failed to fetch ${endpoint}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network error
      throw new ApiError(
        0,
        'Network Error',
        'Failed to connect to API. Please check your internet connection.'
      );
    }
  }

  /**
   * POST запрос
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText,
          `Failed to post to ${endpoint}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network error
      throw new ApiError(
        0,
        'Network Error',
        'Failed to connect to API. Please check your internet connection.'
      );
    }
  }

  /**
   * PUT запрос
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText,
          `Failed to update ${endpoint}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(0, 'Network Error', 'Failed to connect to API');
    }
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText,
          `Failed to delete ${endpoint}`
        );
      }

      // DELETE может вернуть пустой ответ
      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(0, 'Network Error', 'Failed to connect to API');
    }
  }
}

// Экспортируем singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Экспортируем также класс для тестирования
export { ApiClient };
