'use client';

import { useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import styles from './style.module.scss';

export default function ConcertsPage() {
  const { data, loading, error } = useData();

  useEffect(() => {
    // Enable scrolling
    document.body.classList.add('page-scrollable');
    return () => {
      document.body.classList.remove('page-scrollable');
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles.concertsPage}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.concertsPage}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  const concerts = data?.concerts || [];

  if (concerts.length === 0) {
    return (
      <div className={styles.concertsPage}>
        <div className={styles.empty}>Концертов пока нет</div>
      </div>
    );
  }

  return (
    <div className={styles.concertsPage}>
      <div className={styles.concertsGrid}>
        {concerts.map((concert) => (
          <div key={concert.id} className={styles.concertRow}>
            <div className={styles.concertDate}>{formatDate(concert.date)}</div>
            <div className={styles.concertCity}>{concert.city}</div>
            <div className={styles.concertVenue}>{concert.venue}</div>
            <a
              href={concert.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ticketButton}
            >
              БИЛЕТЫ
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
