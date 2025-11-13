# Glass Effects - Шпаргалка

## Базовые классы

| Класс | Описание | Backdrop-filter |
|-------|----------|-----------------|
| `.glass-fake` | Псевдо-стекло | ❌ Нет |
| `.glass-real` | Реальное стекло | ✅ Да |

## Модификаторы цвета

### Для псевдо-стекла
- `.glass-fake-light` - светлое (#e0e0e0)
- `.glass-fake-medium` - среднее (#a3a3a3) - по умолчанию
- `.glass-fake-dark` - темное (#4c4c4c)

### Для реального стекла
- `.glass-real-light` - светлое (#e0e0e0)
- `.glass-real-medium` - среднее (#a3a3a3) - по умолчанию
- `.glass-real-dark` - темное (#4c4c4c)

## Модификаторы интенсивности

- `.glass-subtle` - тонкий эффект (8% opacity, 4px blur)
- `.glass-normal` - обычный (12% opacity, 8px blur) - по умолчанию
- `.glass-strong` - сильный (18% opacity, 12px blur)

## Модификаторы интерактивности

⚠️ **По умолчанию стеклянные эффекты статичны!**

- `.glass-animated` - плавные переходы
- `.glass-hoverable` - hover эффект
- `.glass-pressable` - active эффект (нажатие)
- `.glass-focusable` - focus outline
- `.glass-interactive` - все вместе (для кнопок)
- `.glass-disabled` - отключенное состояние

## Готовые компоненты

### Карточки (статичные)
```html
<div class="card">Базовая (glass-fake-dark, без hover)</div>
<div class="card-glass">С backdrop-filter</div>
<div class="card glass-fake glass-hoverable">С hover эффектом</div>
```

### Кнопки (интерактивные)
```html
<!-- Реальное стекло (автоматически .glass-interactive) -->
<button class="button button-m button-glass">Кнопка</button>
<button class="button button-m button-glass button-glass-light">Светлая</button>
<button class="button button-m button-glass button-glass-dark">Темная</button>

<!-- Псевдо-стекло (автоматически .glass-interactive) -->
<button class="button button-m button-glass-fake">Кнопка</button>
<button class="button button-m button-glass-fake button-glass-fake-light">Светлая</button>
<button class="button button-m button-glass-fake button-glass-fake-dark">Темная</button>
```

## Примеры комбинаций

```html
<!-- Статичная карточка (без hover) -->
<div class="card glass-fake glass-fake-light glass-subtle">...</div>

<!-- Карточка с hover -->
<div class="card glass-fake glass-fake-dark glass-hoverable">...</div>

<!-- Интерактивная карточка (кликабельная) -->
<div class="card glass-real glass-real-dark glass-strong glass-interactive">...</div>

<!-- Кнопка (автоматически интерактивная) -->
<button class="button button-m button-glass glass-subtle">Кнопка</button>

<!-- Кастомная интерактивность -->
<div class="glass-fake glass-animated glass-hoverable glass-pressable">...</div>
```

## Когда что использовать

### `.glass-fake` (псевдо-стекло)
✅ Используй для:
- Карточек
- Кнопок
- Статичных элементов
- Мобильных устройств
- Когда важна производительность

### `.glass-real` (реальное стекло)
✅ Используй для:
- Модальных окон
- Оверлеев
- Элементов поверх изображений
- Wow-эффектов
- Десктопных приложений

## Производительность

| Тип | Производительность | Использование |
|-----|-------------------|---------------|
| `.glass-fake` | 🟢 Отличная | Без ограничений |
| `.glass-real` | 🟡 Средняя | Умеренно |
| `.glass-real.glass-strong` | 🔴 Низкая | Минимально |

## CSS переменные для кастомизации

```css
:root {
    /* Цвета */
    --glass-color-light: #e0e0e0;
    --glass-color-medium: #a3a3a3;
    --glass-color-dark: #4c4c4c;

    /* Интенсивность */
    --glass-reflex-light: 0.3;
    --glass-reflex-dark: 2;

    /* Прозрачность */
    --glass-bg-opacity-subtle: 8%;
    --glass-bg-opacity-normal: 12%;
    --glass-bg-opacity-strong: 18%;

    /* Размытие */
    --glass-blur-subtle: 4px;
    --glass-blur-normal: 8px;
    --glass-blur-strong: 12px;
}
```
