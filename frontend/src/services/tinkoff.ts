/**
 * Tinkoff Payment Integration
 */

interface TinkoffInitResponse {
  Success: boolean;
  ErrorCode?: string;
  Message?: string;
  TerminalKey: string;
  Amount: number;
  OrderId: string;
  PaymentURL: string;
  PaymentId: string;
}

/**
 * Инициализировать платеж через Tinkoff
 */
export async function initPayment(
  orderId: number,
  amount: number
): Promise<TinkoffInitResponse> {
  const terminalKey = process.env.NEXT_PUBLIC_TINKOFF_TERMINAL_KEY;

  if (!terminalKey) {
    throw new Error('Tinkoff Terminal Key not configured');
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3010';

  const response = await fetch('https://securepay.tinkoff.ru/v2/Init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TerminalKey: terminalKey,
      Amount: amount * 100, // Convert to kopecks
      OrderId: orderId.toString(),
      Description: `Заказ #${orderId} на сайте Асия`,
      SuccessURL: `${siteUrl}/success?order=${orderId}`,
      FailURL: `${siteUrl}/fail?order=${orderId}`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to initialize Tinkoff payment');
  }

  const data: TinkoffInitResponse = await response.json();

  if (!data.Success) {
    throw new Error(data.Message || 'Tinkoff payment initialization failed');
  }

  return data;
}

/**
 * Перенаправить пользователя на страницу оплаты Tinkoff
 */
export function redirectToPayment(paymentUrl: string): void {
  window.location.href = paymentUrl;
}
