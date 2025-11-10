'use client';

import { useState, useEffect } from 'react';
import styles from './style.module.scss';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Политика в отношении обработки персональных данных',
    answer: 'Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни. Подробнее можно получить о посетителях веб-сайта https://асия.com.',
  },
  {
    question: 'Есть ли возможность вернуть мерч, если он не подошел?',
    answer: 'Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не был в употреблении и сохранена упаковка. Для возврата свяжитесь с нами через контакты.',
  },
  {
    question: 'Как долго доставляется заказ?',
    answer: 'Доставка по России занимает от 3 до 10 рабочих дней в зависимости от региона. Международная доставка может занять до 30 дней.',
  },
  {
    question: 'Можно ли купить билеты на концерты через сайт?',
    answer: 'Информация о концертах и ссылки на покупку билетов доступны в разделе "Концерты". Билеты продаются через официальные площадки.',
  },
  {
    question: 'Как связаться с артистом по вопросам сотрудничества?',
    answer: 'Для вопросов сотрудничества используйте контактную форму на странице "Контакты" или напишите на официальную почту.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    document.body.classList.add('page-scrollable');
    return () => {
      document.body.classList.remove('page-scrollable');
    };
  }, []);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqPage}>
      <div className="container-m">
        <h1 className={styles.title}>Часто задаваемые вопросы</h1>
        
        <div className={styles.faqList}>
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
              >
                <span>{item.question}</span>
                <svg
                  className={styles.icon}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              
              <div className={styles.faqAnswer}>
                <div className={styles.faqAnswerContent}>
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
