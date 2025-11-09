'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/features/cart/hooks/useCart';
import { createOrder } from '@/services/orders';
import styles from './style.module.scss';

export function CheckoutForm() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deliveryMethod, setDeliveryMethod] = useState<'sdek' | 'pickup'>('sdek');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
    }).format(price);
  };

  const deliveryCost = deliveryMethod === 'sdek' ? 990 : 0;
  const finalTotal = total + deliveryCost;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ФИО';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total_amount: finalTotal,
      };

      await createOrder(orderData);
      clearCart();
      router.push('/success');
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Не удалось оформить заказ. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.checkoutForm} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>
        <span>Данные для доставки</span>
        <span className={styles.deliveryIcon}>📦 СДЭК</span>
      </h2>

      <div className={styles.formFields}>
        <div className={styles.formRow}>
          <label className={styles.fieldLabel}>ФИО</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Иванов Иван Иванович"
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            disabled={loading}
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.fieldLabel}>ТЕЛЕФОН</label>
          <div className={styles.phoneInput}>
            <span className={styles.phonePrefix}>RUS +7</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="00 00 00 000"
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.fieldLabel}>АДРЕС</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Россия, г. Москва, ул. Арбатская"
            className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
            disabled={loading}
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.fieldLabel}>ПОЧТА</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="pochta_primer@pochta.com"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            disabled={loading}
          />
        </div>
      </div>

      <div className={styles.orderSummary}>
        <div className={styles.summaryRow}>
          <span>ДОСТАВКА</span>
          <span>{deliveryCost} ₽</span>
        </div>
        {items.map((item) => (
          <div key={item.product.id} className={styles.summaryRow}>
            <span>{item.product.title}</span>
            <span>{formatPrice(item.product.price * item.quantity)} ₽</span>
          </div>
        ))}
        <div className={`${styles.summaryRow} ${styles.total}`}>
          <span>ИТОГО:</span>
          <span>{formatPrice(finalTotal)} ₽</span>
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading || items.length === 0}
      >
        {loading ? 'ОФОРМЛЕНИЕ...' : 'КУПИТЬ'}
      </button>
    </form>
  );
}
