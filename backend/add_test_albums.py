#!/usr/bin/env python
"""
Скрипт для создания тестовых альбомов с треками
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.music.models import Album, Track

def create_test_albums():
    """Создает тестовые альбомы и привязывает к ним треки"""

    print('🎵 Создание тестовых альбомов...\n')

    # Альбом 1: Детство
    album1, created = Album.objects.get_or_create(
        slug='detstvo',
        defaults={
            'title': 'Детство',
            'artist': 'АСИЯ',
            'year': 2023,
            'description': 'Дебютный альбом с хитами о молодости и мечтах',
            'order': 0,
            'is_published': True,
        }
    )

    if created:
        print(f'✅ Создан альбом: {album1.title} ({album1.slug})')
    else:
        print(f'ℹ️  Альбом уже существует: {album1.title}')

    # Альбом 2: Ночные огни
    album2, created = Album.objects.get_or_create(
        slug='nochnye-ogni',
        defaults={
            'title': 'Ночные огни',
            'artist': 'АСИЯ',
            'year': 2024,
            'description': 'Второй альбом с более зрелым звучанием',
            'order': 1,
            'is_published': True,
        }
    )

    if created:
        print(f'✅ Создан альбом: {album2.title} ({album2.slug})')
    else:
        print(f'ℹ️  Альбом уже существует: {album2.title}')

    print('\n📀 Привязка треков к альбомам...\n')

    # Получаем все треки
    tracks = list(Track.objects.all().order_by('id'))

    if len(tracks) < 3:
        print('⚠️  Недостаточно треков для привязки к альбомам')
        return

    # Привязываем первые 3 трека к первому альбому
    for i, track in enumerate(tracks[:3], 1):
        track.album = album1
        track.year = 2023
        track.order = i
        track.save()
        print(f'  ✓ {track.title} → {album1.title} (порядок: {i})')

    # Привязываем оставшиеся треки ко второму альбому
    for i, track in enumerate(tracks[3:], 1):
        track.album = album2
        track.year = 2024
        track.order = i
        track.save()
        print(f'  ✓ {track.title} → {album2.title} (порядок: {i})')

    print('\n' + '='*60)
    print('✨ Готово!')
    print('='*60)
    print(f'\n📊 Статистика:')
    print(f'  • Альбомов создано: 2')
    print(f'  • Треков в "{album1.title}": {album1.tracks.count()}')
    print(f'  • Треков в "{album2.title}": {album2.tracks.count()}')
    print(f'\n🔗 URL альбомов:')
    print(f'  • /albums/{album1.slug}')
    print(f'  • /albums/{album2.slug}')
    print('\n💡 Теперь можно открыть страницу /tracks и переключиться на "АЛЬБОМЫ"')


if __name__ == '__main__':
    create_test_albums()
