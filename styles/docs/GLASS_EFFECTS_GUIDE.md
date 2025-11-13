# Glass Effects System

Единая система стеклянных эффектов для UI компонентов.

## Основные классы

### Псевдо-стекло (без backdrop-filter)

Используется когда нужен стеклянный эффект без размытия фона. Подходит для большинства случаев и работает быстрее.

```html
<!-- Базовый эффект (статичный) -->
<div class="card glass-fake">...</div>

<!-- С модификаторами цвета -->
<div class="card glass-fake glass-fake-light">Светлое стекло</div>
<div class="card glass-fake glass-fake-medium">Среднее стекло (по умолчанию)</div>
<div class="card glass-fake glass-fake-dark">Темное стекло</div>

<!-- С модификаторами интенсивности -->
<div class="card glass-fake glass-subtle">Тонкий эффект</div>
<div class="card glass-fake glass-normal">Обычный эффект (по умолчанию)</div>
<div class="card glass-fake glass-strong">Сильный эффект</div>

<!-- С интерактивностью -->
<div class="card glass-fake glass-hoverable">С hover эффектом</div>
<button class="button glass-fake glass-interactive">Полностью интерактивная кнопка</button>
```

### Реальное стекло (с backdrop-filter)

Используется когда нужно реальное размытие фона. Более ресурсоемкий, но создает настоящий эффект стекла.

```html
<!-- Базовый эффект (статичный) -->
<div class="card glass-real">...</div>

<!-- С модификаторами цвета -->
<div class="card glass-real glass-real-light">Светлое стекло</div>
<div class="card glass-real glass-real-medium">Среднее стекло (по умолчанию)</div>
<div class="card glass-real glass-real-dark">Темное стекло</div>

<!-- С модификаторами интенсивности -->
<div class="card glass-real glass-subtle">Тонкий эффект</div>
<div class="card glass-real glass-normal">Обычный эффект (по умолчанию)</div>
<div class="card glass-real glass-strong">Сильный эффект</div>

<!-- С интерактивностью -->
<div class="card glass-real glass-hoverable">С hover эффектом</div>
<button class="button glass-real glass-interactive">Полностью интерактивная кнопка</button>
```

## Модификаторы интерактивности

По умолчанию стеклянные эффекты статичны. Добавляйте эти классы для интерактивности:

### .glass-animated
Добавляет плавные переходы (transitions)
```html
<div class="card glass-fake glass-animated">Плавные переходы</div>
```

### .glass-hoverable
Добавляет hover эффект (усиление стекла при наведении)
```html
<div class="card glass-fake glass-hoverable">Hover эффект</div>
```

### .glass-pressable
Добавляет active эффект (нажатие с scale)
```html
<button class="button glass-fake glass-pressable">Нажимаемая кнопка</button>
```

### .glass-focusable
Добавляет focus-visible outline для доступности
```html
<button class="button glass-fake glass-focusable">С focus</button>
```

### .glass-interactive
Комбинирует все интерактивные эффекты (для кнопок)
```html
<button class="button glass-fake glass-interactive">Полностью интерактивная</button>
```

### .glass-disabled
Отключает элемент (opacity + pointer-events)
```html
<button class="button glass-fake glass-disabled">Отключена</button>
```

## Использование с компонентами

### Карточки

```html
<!-- Базовая карточка (уже использует glass-fake-dark) -->
<div class="card">...</div>

<!-- Карточка с реальным стеклом -->
<div class="card-glass">...</div>

<!-- Кастомная карточка -->
<div class="card-base glass-real glass-real-light glass-subtle">...</div>
```

### Кнопки

```html
<!-- Реальное стекло -->
<button class="button button-m button-glass">Кнопка</button>
<button class="button button-m button-glass button-glass-light">Светлая</button>
<button class="button button-m button-glass button-glass-dark">Темная</button>

<!-- Псевдо-стекло -->
<button class="button button-m button-glass-fake">Кнопка</button>
<button class="button button-m button-glass-fake button-glass-fake-light">Светлая</button>
<button class="button button-m button-glass-fake button-glass-fake-dark">Темная</button>

<!-- С интенсивностью -->
<button class="button button-m button-glass glass-subtle">Тонкий эффект</button>
<button class="button button-m button-glass glass-strong">Сильный эффект</button>
```

### Секции

```html
<!-- Секция с псевдо-стеклом -->
<section class="card glass-fake glass-fake-medium">
    <h2>Заголовок</h2>
    <p>Контент...</p>
</section>

<!-- Секция с реальным стеклом -->
<section class="card glass-real glass-real-dark glass-subtle">
    <h2>Заголовок</h2>
    <p>Контент...</p>
</section>
```

## Комбинирование модификаторов

Модификаторы можно комбинировать для достижения нужного эффекта:

```html
<!-- Светлое псевдо-стекло с тонким эффектом -->
<div class="card glass-fake glass-fake-light glass-subtle">...</div>

<!-- Темное реальное стекло с сильным эффектом -->
<div class="card glass-real glass-real-dark glass-strong">...</div>
```

## CSS переменные

Можно кастомизировать эффекты через CSS переменные:

```css
:root {
    /* Базовые цвета */
    --glass-color-light: #e0e0e0;
    --glass-color-medium: #a3a3a3;
    --glass-color-dark: #4c4c4c;

    /* Интенсивность бликов и теней */
    --glass-reflex-light: 0.3;
    --glass-reflex-dark: 2;

    /* Прозрачность фона */
    --glass-bg-opacity-subtle: 8%;
    --glass-bg-opacity-normal: 12%;
    --glass-bg-opacity-strong: 18%;

    /* Размытие (только для glass-real) */
    --glass-blur-subtle: 4px;
    --glass-blur-normal: 8px;
    --glass-blur-strong: 12px;
}
```

## Когда использовать что

### Псевдо-стекло (.glass-fake)
- ✅ Для большинства UI элементов
- ✅ Когда важна производительность
- ✅ Для статичных элементов
- ✅ Для мобильных устройств

### Реальное стекло (.glass-real)
- ✅ Для модальных окон
- ✅ Для оверлеев
- ✅ Для элементов поверх изображений
- ✅ Когда нужен wow-эффект

## Производительность

- **glass-fake**: Легкий, не влияет на производительность
- **glass-real**: Ресурсоемкий из-за backdrop-filter, используйте умеренно

## Браузерная поддержка

- **glass-fake**: Все современные браузеры
- **glass-real**: Требует поддержки backdrop-filter (все современные браузеры, кроме старых версий Firefox)
