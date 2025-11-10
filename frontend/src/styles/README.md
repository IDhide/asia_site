# Стили проекта

Единый источник правды для всех стилей проекта.

## Структура

- `variables.scss` - переменные (цвета, размеры, breakpoints)
- `mixins.scss` - утилитарные миксины (glass-effect, scrollbar, etc.)
- `components.scss` - компоненты UI (кнопки, карточки, типографика)
- `globals.scss` - глобальные стили
- `fonts.css` - шрифты

## Использование

### Импорт

```scss
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;
@use '@/styles/components' as *;
```

### Кнопки

```scss
// Базовая стеклянная кнопка (3 размера)
.smallButton {
  @include button-glass('sm'); // маленькая
}

.mediumButton {
  @include button-glass('md'); // средняя (по умолчанию)
  // или просто:
  @include button-glass;
}

.largeButton {
  @include button-glass('lg'); // большая
}

// Кнопка-переключатель (с размерами)
.toggleButton {
  @include button-toggle('lg'); // можно указать размер
  
  &.active {
    // стили для активного состояния уже включены
  }
}

// Кнопка "Назад" (с размерами)
.backButton {
  @include button-back('md');
}

// Иконочная кнопка
.iconButton {
  @include button-icon; // по умолчанию clamp(48px, 6vw, 56px)
  // или с кастомным размером:
  @include button-icon(64px);
}
```

### Карточки и контейнеры

```scss
// Базовая стеклянная карточка
.card {
  @include card-glass;
}

// Интерактивная карточка с hover
.interactiveCard {
  @include card-interactive;
}

// Компактная карточка
.compactCard {
  @include card-compact;
}

// Обертка для обложки
.coverWrapper {
  @include cover-wrapper;
}
```

### Кнопки соцсетей

```scss
// Сетка кнопок (3 в ряд)
.socialButtons {
  @include social-buttons-grid;
}

// Отдельная кнопка
.socialButton {
  @include social-button;
}
```

### Типографика

```scss
// Заголовок страницы
.pageTitle {
  @include heading-page;
}

// Заголовок секции
.sectionTitle {
  @include heading-section;
}

// Заголовок карточки
.cardTitle {
  @include heading-card;
}

// Подзаголовок
.subtitle {
  @include text-subtitle;
}

// Метаданные (год, дата)
.meta {
  @include text-meta;
}
```

### Состояния

```scss
// Загрузка
.loading {
  @include state-loading;
}

// Ошибка
.error {
  @include state-error;
}
```

### Layout

```scss
// Контейнер страницы
.page {
  @include page-container;
}

// Сетка контента (2 колонки, адаптивная)
.contentGrid {
  @include content-grid;
}

// Sticky секция
.coverSection {
  @include sticky-section;
}
```

## Примеры замены

### Было:
```scss
.myButton {
  @include glass-effect;
  padding: clamp(10px, 1.5vw, 14px) clamp(20px, 3vw, 28px);
  border-radius: $radius-pill;
  font-size: clamp(14px, 1.8vw, 16px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all $transition-fast;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px);
  }
}
```

### Стало:
```scss
.myButton {
  @include button-glass;
}
```

## Преимущества

- ✅ Единый источник правды
- ✅ Консистентность дизайна
- ✅ Легкость обновления
- ✅ Меньше дублирования кода
- ✅ Адаптивность из коробки
