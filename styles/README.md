# @olenev/styles

Система стилей для монорепозитория Olenev с прогрессивной загрузкой.

## 📁 Структура

```
src/
├── main/              # Критически важные стили
│   ├── variables.scss # CSS переменные
│   ├── themes.scss    # Темы (темная/светлая)
│   ├── fonts.scss     # Типографика
│   ├── base.scss      # Базовые стили HTML элементов
│   ├── glass-effects.scss # 🆕 Система стеклянных эффектов
│   ├── buttons.scss   # Кнопки
│   ├── grids.scss     # Сетки
│   ├── separators.scss # Разделители
│   ├── cards_main.scss # Карточки
│   └── blocks.scss    # Блоки контента
│
├── components/        # UI компоненты
│   ├── forms.scss     # Формы (input, select, checkbox, etc)
│   ├── tables.scss    # Таблицы
│   ├── modals.scss    # Модальные окна
│   ├── dropdowns.scss # Выпадающие списки
│   ├── alerts.scss    # Алерты
│   ├── badges.scss    # Бейджи
│   ├── tooltips.scss  # Подсказки
│   ├── tabs.scss      # Табы
│   ├── progress.scss  # Прогресс-бары
│   ├── skeletons.scss # Скелетоны загрузки
│   ├── close-buttons.scss # Кнопки закрытия
│   └── social-buttons.scss # Кнопки социальных сетей
│
├── features/          # Специализированные фичи
│   ├── cards.scss     # Карточки проектов
│   └── rich-text-media.scss # Rich text editor и рендер
│
├── core.scss          # Только критичные стили
├── index.scss         # ВСЕ стили (не рекомендуется!)
```

## 🚀 Использование

### ⚡ Progressive Loading (рекомендуется)

Трехэтапная загрузка для оптимальной производительности:

#### 1. Critical CSS (синхронно в layout)

```scss
// apps/admin/src/app/critical.scss
@import '@olenev/styles/core';
```

#### 2. Page-specific styles (на конкретных страницах)

```tsx
// Динамическая загрузка на странице
import { usePageStyles } from '@/hooks/usePageStyles';

export default function NewsPage() {
    usePageStyles(['rich-text-media']); // Только для этой страницы
    return <article>...</article>;
}
```

#### 3. Full bundle (асинхронная предзагрузка)

```scss
// apps/admin/src/app/full.scss
@import '@olenev/styles/components/forms';
@import '@olenev/styles/components/tables';
@import '@olenev/styles/components/modals';
// ... остальные компоненты
```

### 📦 Модульный импорт

Если не нужна прогрессивная загрузка, можно импортировать напрямую:

```scss
// Критические стили
@import '@olenev/styles/core';

// Конкретные компоненты
@import '@olenev/styles/components/forms';
@import '@olenev/styles/components/tables';

// Фичи
@import '@olenev/styles/features/rich-text-media';
```

### 🎯 Импорт стилей компонентов в TypeScript

**ВАЖНО:** Стили UI компонентов нужно импортировать в TypeScript файлах компонентов, а НЕ в SCSS файлах!

```tsx
// ✅ ПРАВИЛЬНО: Импорт в TypeScript компоненте
import '@olenev/styles/components/slider.scss';

export default function MyComponent() {
    return <div>...</div>;
}
```

```scss
/* ❌ НЕПРАВИЛЬНО: Импорт в SCSS файле */
@import '@olenev/styles/components/slider.scss';
```

Почему так? Потому что webpack в Next.js не может правильно разрешать импорты SCSS между пакетами в монорепозитории. Импорт в TypeScript гарантирует корректную загрузку стилей.

### ❌ НЕ ДЕЛАЙТЕ ТАК:

```scss
@import '@olenev/styles'; // Загружает ВСЕ стили (~50KB+)!
```

## 🎯 Примеры

### Admin Panel:

```tsx
// apps/admin/src/app/layout.tsx
import './critical.scss'; // @olenev/styles/core
import './admin.scss'; // Кастомные стили
import { AdminStylesPreloader } from './StylesPreloader';

export default function AdminLayout({ children }) {
    return (
        <html>
            <body>
                {children}
                <AdminStylesPreloader />
            </body>
        </html>
    );
}
```

### Studio (публичный сайт):

```tsx
// apps/studio/src/features/main/components/MainLayout/index.tsx
import './style/critical.scss'; // @olenev/styles/core
import { StylesPreloader } from './StylesPreloader';

export default function StudioLayout({ children }) {
    return (
        <html>
            <body>
                {children}
                <StylesPreloader />
            </body>
        </html>
    );
}
```

### OlID (минимальное приложение):

```tsx
// apps/olid/src/app/layout.tsx
import '@olenev/styles/core'; // Только критические стили

export default function OlidLayout({ children }) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
```

## ✨ Система стеклянных эффектов

Единая система для создания стеклянных UI элементов. Подробная документация: [GLASS_EFFECTS_GUIDE.md](./docs/GLASS_EFFECTS_GUIDE.md)

### Быстрый старт:

```html
<!-- Псевдо-стекло (без backdrop-filter) -->
<div class="card glass-fake glass-fake-dark">Карточка</div>
<button class="button button-m button-glass-fake">Кнопка</button>

<!-- Реальное стекло (с backdrop-filter) -->
<div class="card glass-real glass-real-medium">Карточка</div>
<button class="button button-m button-glass">Кнопка</button>

<!-- Модификаторы -->
<div class="card glass-fake glass-fake-light glass-subtle">Светлое тонкое стекло</div>
<div class="card glass-real glass-real-dark glass-strong">Темное сильное стекло</div>
```

### Варианты:
- **Цвет**: `-light`, `-medium`, `-dark`
- **Интенсивность**: `.glass-subtle`, `.glass-normal`, `.glass-strong`
- **Тип**: `.glass-fake` (без размытия), `.glass-real` (с размытием)

## 🎨 CSS Переменные

Система поддерживает темную (по умолчанию) и светлую темы. Элементы с классом `.adaptive` автоматически адаптируются к теме.

### Основные переменные:

```scss
// Фоны
--bg-color
--card-bg
--card-bg-secondary

// Границы
--border-color
--border-hover

// Текст
--text-color
--text-secondary-color
```

## ⚠️ Важно

1. **Всегда импортируйте `core` первым** - он содержит переменные и базовые стили
2. **Не импортируйте весь пакет** - используйте модульные импорты
3. **Используйте прогрессивную загрузку** - critical → page-specific → full
4. **Импортируйте стили компонентов в TypeScript, а не в SCSS** - webpack не может разрешать кросс-пакетные импорты SCSS

## 🤝 Вклад в разработку

При добавлении новых стилей:

1. **Критичные стили** → `src/main/`
2. **UI компоненты** → `src/components/`
3. **Специализированные фичи** → `src/features/`

## 🧰 Утилиты для верстки секций

Для единообразной верстки внутри секций добавлены короткие утилиты:

- `.si` — базовый внутренний контейнер (max-width + боковые паддинги)
- `.si-xs`, `.si-s`, `.si-m`, `.si-l`, `.si-xl` — вертикальные паддинги по размерам
- `.si-0` — сброс вертикальных паддингов

Примеры использования:

```html
<section class="medium-width-block">
    <div class="si si-m">
        <h2 class="h2">Заголовок секции</h2>
        <p class="p2">Текст внутри секции с медленными отступами сверху/снизу.</p>
    </div>
</section>

<!-- Без вертикальных отступов -->
<section class="full-width-block">
    <div class="si si-0">
        <!-- плотный контент, например слайдер -->
    </div>
</section>
```

Значения паддингов управляются переменными в `src/main/variables.scss`:
`--section-padding-xs`, `--section-padding-s`, `--section-padding-m`, `--section-padding-l`, `--section-padding-xl`.

