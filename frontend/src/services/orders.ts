import { apiClient } from './api';
import type { Order, OrderData } from '@/types/order';

/**
 * Создать новый заказ
 */
export async function createOrder(data: OrderData): Promise<Order> {
  return apiClient.post<Order>('/api/orders/', data);
}

/**
 * Получить заказ по ID
 */
export async function getOrder(id: number): Promise<Order> {
  return apiClient.get<Order>(`/api/orders/${id}/`);
}

/**
 * Обновить статус оплаты заказа (callback от Tinkoff)
 */
export async function updateOrderPayment(
  orderId: number,
  paymentData: any
): Promise<Order> {
  return apiClient.post<Order>(`/api/orders/${orderId}/payment/`, paymentData);
}
