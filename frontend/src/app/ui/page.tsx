'use client';

import { useState, useEffect } from 'react';
import styles from './style.module.scss';

export default function UIPage() {
  const [activeToggle, setActiveToggle] = useState('option1');
  const [activeSize, setActiveSize] = useState('M');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    document.body.classList.add('page-scrollable');
    return () => {
      document.body.classList.remove('page-scrollable');
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className={styles.uiPage}>
      <div className="container-m">
        <h1 className={styles.pageTitle}>UI Design System</h1>
        <p className={styles.pageSubtitle}>Компоненты и стили проекта</p>

        {/* Buttons */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Кнопки</h2>
          
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Glass Buttons</h3>
            <div className={styles.row}>
              <button className={styles.buttonGlassXs}>Extra Small</button>
              <button className={styles.buttonGlassS}>Small</button>
              <button className={styles.buttonGlassM}>Medium</button>
              <button className={styles.buttonGlassL}>Large</button>
              <button className={styles.buttonGlassXl}>Extra Large</button>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Icon Buttons</h3>
            <div className={styles.row}>
              <button className={styles.buttonIcon}>✕</button>
              <button className={styles.buttonIcon}>‹</button>
              <button className={styles.buttonIcon}>›</button>
              <button className={styles.buttonIcon}>+</button>
            </div>
          </div>
        </section>

        {/* Toggles */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Переключатели</h2>
          
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Standard Toggle Group</h3>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.togglePill} ${activeToggle === 'option1' ? styles.active : ''}`}
                onClick={() => setActiveToggle('option1')}
              >
                Опция 1
              </button>
              <button
                className={`${styles.togglePill} ${activeToggle === 'option2' ? styles.active : ''}`}
                onClick={() => setActiveToggle('option2')}
              >
                Опция 2
              </button>
              <button
                className={`${styles.togglePill} ${activeToggle === 'option3' ? styles.active : ''}`}
                onClick={() => setActiveToggle('option3')}
              >
                Опция 3
              </button>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Light Toggle Group</h3>
            <div className={styles.toggleGroupLight}>
              <button className={`${styles.togglePillLight} ${styles.separator}`}>‹</button>
              <button className={styles.togglePillLight}>›</button>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Size Selector</h3>
            <div className={styles.toggleGroupSmall}>
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  className={`${styles.togglePillSmall} ${activeSize === size ? styles.active : ''}`}
                  onClick={() => setActiveSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Карточки</h2>
          
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Glass Card</h3>
            <div className={styles.cardGlass}>
              <h4>Заголовок карточки</h4>
              <p>Это пример стеклянной карточки с текстом внутри.</p>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Interactive Card</h3>
            <div className={styles.cardInteractive}>
              <h4>Интерактивная карточка</h4>
              <p>Наведите курсор для эффекта hover.</p>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Compact Card</h3>
            <div className={styles.cardCompact}>
              <p>Компактная карточка с меньшими отступами.</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Типографика</h2>
          
          <div className={styles.group}>
            <h1 className={styles.headingPage}>Page Heading</h1>
            <h2 className={styles.headingSection}>Section Heading</h2>
            <h3 className={styles.headingCard}>Card Heading</h3>
            <p className={styles.textSubtitle}>Subtitle Text</p>
            <p className={styles.textMeta}>Meta Text (small, secondary)</p>
          </div>
        </section>

        {/* Effects */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Эффекты</h2>
          
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Glass Effect</h3>
            <div className={styles.glassDemo}>
              <p>Стеклянный эффект с размытием</p>
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={styles.groupTitle}>Button Glow</h3>
            <button className={styles.buttonGlow}>Кнопка с свечением</button>
          </div>
        </section>

        {/* Accordion */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Аккордеон</h2>
          
          <div className={styles.group}>
            <h3 className={styles.groupTitle}>FAQ Accordion</h3>
            <div className={styles.accordionList}>
              {[
                { q: 'Что такое дизайн-система?', a: 'Дизайн-система — это набор переиспользуемых компонентов и стилей для создания консистентного интерфейса.' },
                { q: 'Как использовать миксины?', a: 'Импортируйте @use "@/styles" as * и используйте любой миксин через @include.' },
                { q: 'Поддерживается ли мобильная версия?', a: 'Да, все компоненты адаптивны и работают на всех устройствах.' },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${styles.accordionItem} ${openAccordion === index ? styles.open : ''}`}
                >
                  <button
                    className={styles.accordionButton}
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={openAccordion === index}
                  >
                    <span>{item.q}</span>
                    <svg
                      className={styles.accordionIcon}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
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
                  <div className={styles.accordionContent}>
                    <div className={styles.accordionContentInner}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Цвета</h2>
          
          <div className={styles.colorGrid}>
            <div className={styles.colorSwatch} style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <span>Text Primary</span>
              <code>rgba(255, 255, 255, 0.95)</code>
            </div>
            <div className={styles.colorSwatch} style={{ background: 'rgba(255, 255, 255, 0.65)' }}>
              <span>Text Secondary</span>
              <code>rgba(255, 255, 255, 0.65)</code>
            </div>
            <div className={styles.colorSwatch} style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <span>Text Meta</span>
              <code>rgba(255, 255, 255, 0.5)</code>
            </div>
            <div className={styles.colorSwatch} style={{ background: 'rgba(18, 18, 18, 0.52)' }}>
              <span>Glass BG</span>
              <code>rgba(18, 18, 18, 0.52)</code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
