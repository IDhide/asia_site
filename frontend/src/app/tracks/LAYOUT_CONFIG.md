# Настройки верстки страницы треков

## Структура

```
.tracksPage (flex column, 100vh)
  ├─ .toggleContainer (flex-shrink: 0)
  │   └─ .viewToggle
  │       ├─ button (ТРЕКИ)
  │       └─ button (АЛЬБОМЫ)
  │
  └─ .contentContainer (flex: 1, centered)
      ├─ .sliderWrapper (flex-shrink: 1) - СХЛОПЫВАЕТСЯ
      │   └─ ReleasesSlider
      │
      └─ .trackInfoWrapper (flex-shrink: 0) - НЕ СХЛОПЫВАЕТСЯ
          └─ TrackInfo
```

## Ключевые параметры

### .toggleContainer
- **padding-top**: `clamp(1.5rem, 4vh, 3rem)`
  - 1.5rem на маленьких экранах
  - 4vh в середине (адаптивно опускается к мобильному)
  - 3rem максимум
- **padding-bottom**: `clamp(0.5rem, 1vh, 1rem)`

### .contentContainer
- **gap**: `clamp(2rem, 4vh, 4rem)` - расстояние между обложками и информацией
- **padding**: `0 clamp(1rem, 3vw, 2rem) clamp(2rem, 5vh, 5rem)` - боковые и нижний отступы
- **flex: 1** - занимает всё доступное пространство
- Центрирован по вертикали между переключателем и низом страницы

### .sliderWrapper
- **flex-shrink: 1** - схлопывается при нехватке места
- **width: 100%** - занимает всю ширину контейнера
- Высота определяется содержимым (ReleasesSlider)

### .trackInfoWrapper
- **flex-shrink: 0** - НЕ схлопывается
- **max-width**: `min(50vh, 70vw, 500px)` - ТАКОЙ ЖЕ размер как активная обложка
- Синхронизирован с размером обложки из ReleasesSlider

## Адаптивные брейкпоинты

### max-height: 800px (ноутбуки)
- Уменьшены отступы
- gap: `clamp(1.5rem, 3vh, 2.5rem)`
- Информация: `min(40vh, 60vw, 380px)`

### max-height: 650px (очень низкие экраны)
- Минимальные отступы
- gap: `clamp(1rem, 2vh, 2rem)`
- Информация: `min(35vh, 50vw, 300px)`

### max-width: 768px (планшеты)
- Адаптивные отступы через vw
- gap: `clamp(2rem, 5vw, 3rem)`
- Информация: `min(58vh, 88vw, 420px)`

### max-width: 480px (мобильные)
- Увеличены относительные отступы (6-7vw)
- gap: `clamp(1.5rem, 6vw, 2.5rem)`
- Компактная компоновка

## Важные моменты

1. **Размер информации = размер обложки**: Оба используют одинаковые формулы `min()`
2. **Обложки схлопываются первыми**: `flex-shrink: 1` vs `flex-shrink: 0`
3. **Переключатель адаптивно опускается**: `clamp()` с vh единицами
4. **Страница не скроллится**: `height: 100vh`, `overflow: hidden`
5. **Центрирование**: `.contentContainer` с `justify-content: center`

## Как настроить

### Изменить отступ переключателя от верха
```scss
.toggleContainer {
  padding-top: clamp(МИН, АДАПТИВ, МАКС);
}
```

### Изменить расстояние между обложками и информацией
```scss
.contentContainer {
  gap: clamp(МИН, АДАПТИВ, МАКС);
}
```

### Изменить размер обложек и информации
Нужно синхронно менять в двух местах:
1. `frontend/src/app/tracks/style.module.scss` - `.trackInfoWrapper`
2. `frontend/src/features/tracks/components/ReleasesSlider/style.module.scss` - `.slide`

### Изменить отступ от низа страницы
```scss
.contentContainer {
  padding-bottom: clamp(МИН, АДАПТИВ, МАКС);
}
```
