/**
 * Валидация email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валидация телефона (российский формат)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'));
}

/**
 * Валидация имени (минимум 2 символа)
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

/**
 * Валидация адреса (минимум 10 символов)
 */
export function isValidAddress(address: string): boolean {
  return address.trim().length >= 10;
}

/**
 * Валидация формы заказа
 */
export interface OrderFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function validateOrderForm(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
}): OrderFormErrors {
  const errors: OrderFormErrors = {};

  if (!isValidName(data.name)) {
    errors.name = 'Введите корректное имя (минимум 2 символа)';
  }

  if (!isValidEmail(data.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!isValidPhone(data.phone)) {
    errors.phone = 'Введите корректный номер телефона';
  }

  if (!isValidAddress(data.address)) {
    errors.address = 'Введите корректный адрес доставки (минимум 10 символов)';
  }

  return errors;
}
