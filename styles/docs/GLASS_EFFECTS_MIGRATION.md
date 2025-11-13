# Миграция на новую систему Glass Effects

## Что изменилось

Создана единая система стеклянных эффектов в `glass-effects.scss`, которая заменяет дублирующийся код в карточках и кнопках.

## Автоматические изменения

### Карточки

**Было:**
```scss
.card {
    --c-glass: #4c4c4c;
    --c-light: #fff;
    --c-dark: #000;
    background-color: color-mix(in srgb, var(--c-glass) 12%, transparent);
    box-shadow: /* длинный список теней */;
    // ... много кода
}

.card-glass {
    --c-glass: #4c4c4c;
    backdrop-filter: blur(8px);
    // ... дублирующийся код
}
```

**Стало:**
```scss
.card {
    @extend .glass-fake;
    @extend .glass-fake-dark;
    // ... только специфичные стили карточки
}

.card-glass {
    @extend .glass-real;
    @extend .glass-real-dark;
}
```

### Кнопки

**Было:**
```scss
.button-glass {
    --c-glass: #a3a3a3;
    backdrop-filter: blur(8px);
    // ... 80+ строк кода с hover, active, disabled
}
```

**Стало:**
```scss
.button-glass {
    @extend .glass-real;
    @extend .glass-real-medium;
    color: var(--text-color) !important;
    border-radius: var(--border-color-radius-xl);
}

.button-glass-fake {
    @extend .glass-fake;
    @extend .glass-fake-medium;
    // ...
}
```

## Новые возможности

### 1. Больше вариантов цвета

```html
<!-- Раньше: только один вариант -->
<div class="card">...</div>

<!-- Теперь: три варианта -->
<div class="card glass-fake-light">Светлая</div>
<div class="card glass-fake-medium">Средняя</div>
<div class="card glass-fake-dark">Темная</div>
```

### 2. Контроль интенсивности

```html
<!-- Раньше: фиксированная интенсивность -->
<button class="button button-glass">Кнопка</button>

<!-- Теперь: три уровня -->
<button class="button button-glass glass-subtle">Тонкий</button>
<button class="button button-glass glass-normal">Обычный</button>
<button class="button button-glass glass-strong">Сильный</button>
```

### 3. Выбор между реальным и псевдо-стеклом

```html
<!-- Псевдо-стекло (быстрее, без backdrop-filter) -->
<button class="button button-glass-fake">Кнопка</button>

<!-- Реальное стекло (с backdrop-filter) -->
<button class="button button-glass">Кнопка</button>
```

## Обратная совместимость

Все существующие классы работают как раньше:

- `.card` - работает (использует glass-fake-dark)
- `.card-glass` - работает (использует glass-real-dark)
- `.button-glass` - работает (использует glass-real-medium)

## Рекомендации по обновлению

### Для новых компонентов

Используйте новую систему напрямую:

```html
<!-- ✅ Хорошо -->
<div class="card-base glass-fake glass-fake-light glass-subtle">...</div>
<button class="button button-m button-glass-fake button-glass-fake-dark">...</button>
```

### Для существующих компонентов

Можно оставить как есть или постепенно мигрировать:

```html
<!-- ✅ Работает (старый способ) -->
<div class="card">...</div>

<!-- ✅ Работает (новый способ с большим контролем) -->
<div class="card glass-fake-light glass-subtle">...</div>
```

## Производительность

### До рефакторинга
- Дублирование кода: ~200 строк
- Размер CSS: больше
- Поддержка: сложнее

### После рефакторинга
- Единый источник правды: ~180 строк
- Размер CSS: меньше (благодаря @extend)
- Поддержка: проще
- Новые возможности: больше вариантов

## Кастомизация

Теперь можно легко кастомизировать все стеклянные эффекты через переменные:

```css
/* Кастомная тема */
:root {
    --glass-color-dark: #2c2c2c; /* Темнее */
    --glass-blur-normal: 12px; /* Больше размытия */
    --glass-reflex-light: 0.5; /* Ярче блики */
}
```

## Примеры использования

### Модальное окно

```html
<div class="modal glass-real glass-real-dark glass-strong">
    <div class="modal-content">
        <h2>Заголовок</h2>
        <p>Контент...</p>
    </div>
</div>
```

### Карточка товара

```html
<div class="card glass-fake glass-fake-medium">
    <img src="product.jpg" alt="Product">
    <h3>Название</h3>
    <button class="button button-m button-glass-fake">Купить</button>
</div>
```

### Навигация

```html
<nav class="glass-real glass-real-light glass-subtle">
    <button class="button button-s button-glass-fake button-glass-fake-light">
        Главная
    </button>
    <button class="button button-s button-glass-fake button-glass-fake-light">
        О нас
    </button>
</nav>
```

## Вопросы и ответы

**Q: Нужно ли обновлять существующий код?**
A: Нет, все работает как раньше. Обновляйте постепенно при необходимости.

**Q: Какой вариант использовать для новых компонентов?**
A: Используйте `.glass-fake` для большинства случаев, `.glass-real` для wow-эффектов.

**Q: Как выбрать между light/medium/dark?**
A: Зависит от фона. На темном фоне - light, на светлом - dark, универсальный - medium.

**Q: Можно ли комбинировать модификаторы?**
A: Да! Например: `glass-fake glass-fake-light glass-subtle`

**Q: Влияет ли это на производительность?**
A: `.glass-fake` - нет влияния. `.glass-real` - умеренное влияние из-за backdrop-filter.
