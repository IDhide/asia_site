# Руководство по стеклянным эффектам

## Обзор

В проект интегрирована новая система стеклянных эффектов с улучшенными бликами, тенями и интерактивностью.

## CSS Переменные

Добавлены в `globals.scss`:

```scss
// Базовые цвета для стекла
--glass-color-light: #c2c2c2;
--glass-color-medium: #a3a3a3;
--glass-color-dark: #4c4c4c;

// Цвета для бликов и теней
--glass-highlight: #fff;
--glass-shadow: #000;

// Интенсивность эффектов
--glass-reflex-light: 0.3;
--glass-reflex-dark: 2;

// Прозрачность фона
--glass-bg-opacity-subtle: 8%;
--glass-bg-opacity-normal: 12%;
--glass-bg-opacity-strong: 18%;

// Размытие
--glass-blur-subtle: 4px;
--glass-blur-normal: 8px;
--glass-blur-strong: 12px;

// Насыщенность
--glass-saturation: 150%;
```

## Миксины

### 1. `@include glass-real()`

Реальное стекло с backdrop-filter (рекомендуется):

```scss
@include glass-real(); // По умолчанию: medium, normal
@include glass-real(var(--glass-color-light)); // Светлое стекло
@include glass-real(var(--glass-color-dark), var(--glass-bg-opacity-strong)); // Темное плотное
```

### 2. `@include glass-fake()`

Псевдо-стекло без backdrop-filter (для совместимости):

```scss
@include glass-fake(); // По умолчанию
@include glass-fake(var(--glass-color-medium), var(--glass-bg-opacity-subtle));
```

### 3. `@include glass-shadows()`

Только тени (для кастомизации):

```scss
@include glass-shadows(0.3, 2); // reflex-light, reflex-dark
```

## Готовые классы

### Базовые классы

```html
<!-- Реальное стекло -->
<div class="glass-real">...</div>

<!-- Псевдо-стекло -->
<div class="glass-fake">...</div>
```

### Модификаторы цвета

```html
<div class="glass-real glass-real-light">Светлое</div>
<div class="glass-real glass-real-medium">Среднее</div>
<div class="glass-real glass-real-dark">Темное</div>
```

### Модификаторы интенсивности

```html
<div class="glass-real glass-subtle">Тонкое</div>
<div class="glass-real glass-normal">Нормальное</div>
<div class="glass-real glass-strong">Плотное</div>
```

### Интерактивные модификаторы

```html
<!-- Плавные переходы -->
<div class="glass-real glass-animated">...</div>

<!-- Hover эффект -->
<button class="glass-real glass-hoverable">Hover</button>

<!-- Нажатие -->
<button class="glass-real glass-pressable">Press</button>

<!-- Фокус -->
<button class="glass-real glass-focusable">Focus</button>

<!-- Полностью интерактивная кнопка -->
<button class="glass-real glass-interactive">Кнопка</button>
```

### Комбинирование

```html
<!-- Светлая интерактивная кнопка с тонким эффектом -->
<button class="glass-real glass-real-light glass-subtle glass-interactive">
  Кнопка
</button>

<!-- Темная карточка с плотным эффектом и hover -->
<div class="glass-real glass-real-dark glass-strong glass-animated glass-hoverable">
  Карточка
</div>
```

## Обновленные компоненты

Все компоненты обновлены для использования новой системы:

- **Кнопки** (`_buttons.scss`): `button-glass`, `button-icon`
- **Карточки** (`_cards.scss`): `card-glass`, `card-interactive`, `card-compact`
- **Toggles** (`_toggles.scss`): `toggle-group`, `toggle-group-light`
- **Header** (`components.scss`): `header-menu-button`, `header-icon-button`
- **Формы** (`CheckoutForm`): обновлена форма оформления заказа

## Примеры использования

### В SCSS модулях

```scss
.myCard {
  @include glass-real;
  border-radius: var(--radius-xl);
  padding: var(--gap-l);
  
  &:hover {
    --glass-opacity: calc(var(--glass-bg-opacity-normal) * 1.5);
    @include glass-shadows(calc(var(--glass-reflex-light) * 1.2), calc(var(--glass-reflex-dark) * 1.1));
  }
}
```

### В HTML/JSX

```jsx
<div className="glass-real glass-interactive glass-normal">
  <h2>Заголовок</h2>
  <p>Контент с красивым стеклянным эффектом</p>
</div>
```

## Миграция со старого кода

Старый код:
```scss
@include glass-effect;
@include glass-effect($intensity: 'light');
@include glass-effect($intensity: 'strong');
```

Новый код:
```scss
@include glass-real; // или glass-real()
@include glass-real(var(--glass-color-light), var(--glass-bg-opacity-subtle), var(--glass-blur-subtle));
@include glass-real(var(--glass-color-dark), var(--glass-bg-opacity-strong), var(--glass-blur-strong));
```

## Преимущества новой системы

1. **Реалистичные блики и тени** - многослойные box-shadow создают объемный эффект
2. **Гибкая настройка** - легко изменить цвет, прозрачность, размытие
3. **Интерактивность** - готовые модификаторы для hover, active, focus
4. **Производительность** - использование CSS переменных для динамических изменений
5. **Консистентность** - единая система для всего проекта
