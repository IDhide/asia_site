# Архитектура страницы треков

## Иерархия компонентов

```
TracksPage (page.tsx)
│
├── ViewToggle (встроенный)
│   ├── Button: ТРЕКИ
│   └── Button: АЛЬБОМЫ
│
├── ReleasesSlider
│   └── Swiper
│       └── Slides (обложки треков)
│           └── onClick → открыть модалку
│
├── TrackInfo
│   ├── TextSection
│   │   ├── Title (название)
│   │   └── Artist (исполнитель)
│   │
│   └── Actions
│       ├── LyricsButton ("Тт")
│       └── SocialButtons (6 кнопок)
│
└── TrackDetailModal (условный рендер)
    ├── CloseButton
    └── ContentGrid
        ├── CoverSection
        │   ├── CoverImage
        │   ├── Title
        │   └── Artist
        │
        └── LyricsSection
            ├── Title
            └── LyricsText
```

## Поток данных

```
DataContext
    ↓
TracksPage (state)
    ├── viewMode: 'tracks' | 'albums'
    ├── currentTrackIndex: number
    └── selectedTrack: number | null
    ↓
    ├─→ ReleasesSlider
    │   ├── tracks[] (props)
    │   ├── onSlideChange() → setCurrentTrackIndex
    │   └── onSlideClick() → setSelectedTrack
    │
    ├─→ TrackInfo
    │   ├── track (props)
    │   └── onLyricsClick() → setSelectedTrack
    │
    └─→ TrackDetailModal
        ├── track (props)
        └── onClose() → setSelectedTrack(null)
```

## События и взаимодействия

### 1. Переключение треков
```
User: свайп/клавиши
    ↓
Swiper: slideChange event
    ↓
onSlideChange(index)
    ↓
setCurrentTrackIndex(index)
    ↓
TrackInfo обновляется
```

### 2. Открытие модалки
```
User: клик на обложку ИЛИ кнопку "Тт"
    ↓
handleTrackClick()
    ↓
setSelectedTrack(currentTrackIndex)
    ↓
TrackDetailModal рендерится
    ↓
body.overflow = 'hidden'
```

### 3. Закрытие модалки
```
User: Escape ИЛИ клик вне ИЛИ кнопка ✕
    ↓
handleCloseModal()
    ↓
setSelectedTrack(null)
    ↓
TrackDetailModal размонтируется
    ↓
body.overflow = ''
```

## Стили и темизация

### Переменные (variables.scss)
```scss
$color-glass-bg: rgba(18, 18, 18, 0.52)
$color-glass-border: rgba(255, 255, 255, 0.18)
$transition-fast: 0.22s ease
```

### Миксины (mixins.scss)
```scss
@mixin glass-effect
@mixin custom-scrollbar
@mixin button-glow
```

### Адаптивные размеры
```scss
clamp(min, preferred, max)
// Пример: clamp(16px, 2.3vw, 20px)
```

## Оптимизация

### Производительность
- Динамический импорт Swiper
- Lazy loading изображений
- CSS containment
- Will-change для анимаций

### Доступность
- ARIA labels
- Keyboard navigation
- Focus management
- Semantic HTML

### SEO
- Semantic markup
- Alt texts для изображений
- Proper heading hierarchy

## Зависимости

```json
{
  "swiper": "^9.x",
  "react": "^18.x",
  "next": "^14.x"
}
```

## Типы

```typescript
interface Track {
  id: number;
  title: string;
  artist: string;
  order: number;
  audio: string;
  cover: string | null;
  lyrics: string;
}

type ViewMode = 'tracks' | 'albums';
```

## Состояние компонента

```typescript
// TracksPage
const [viewMode, setViewMode] = useState<ViewMode>('tracks');
const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
const [selectedTrack, setSelectedTrack] = useState<number | null>(null);

// TrackDetailModal
useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = ''; };
}, []);
```

## Breakpoints

```scss
// Mobile
@media (max-width: 640px) { ... }

// Tablet
@media (max-width: 1024px) { ... }

// Desktop
@media (min-width: 1025px) { ... }
```
