# GradualBlur Component

Компонент градиентного блюра от [reactbits.dev](https://www.reactbits.dev/animations/gradual-blur)

## Использование

```tsx
import GradualBlur from '@/components/GradualBlur';

<GradualBlur
  target="page"
  position="bottom"
  height="12rem"
  strength={3}
  divCount={8}
  curve="ease-out"
  exponential={true}
  opacity={1}
  zIndex={99}
/>
```

## Props

- `target`: 'parent' | 'page' - где применять блюр
- `position`: 'top' | 'bottom' | 'left' | 'right' - позиция блюра
- `height`: string - высота эффекта (например '12rem')
- `strength`: number - сила блюра
- `divCount`: number - количество слоев для плавности
- `curve`: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out' - кривая градиента
- `exponential`: boolean - экспоненциальное увеличение блюра
- `opacity`: number - прозрачность эффекта
- `zIndex`: number - z-index элемента

## Применение в проекте

Компонент используется в Header и Footer для создания эффекта градиентного блюра.
