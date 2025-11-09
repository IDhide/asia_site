#!/usr/bin/env python
"""
Скрипт для добавления тестовых треков
Запуск: python add_test_tracks.py

ВАЖНО: Треки создаются без аудио файлов и обложек.
Загрузите их через Django Admin после создания.
"""
import os
import sys
import django

# Настройка Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.music.models import Track

def add_test_tracks():
    """Добавить тестовые треки"""

    tracks_data = [
        {
            'title': 'Первый трек',
            'artist': 'АСИЯ',
            'order': 1,
            'lyrics': 'Текст первого трека...',
        },
        {
            'title': 'Второй трек',
            'artist': 'АСИЯ',
            'order': 2,
            'lyrics': 'Текст второго трека...',
        },
        {
            'title': 'Третий трек',
            'artist': 'АСИЯ',
            'order': 3,
            'lyrics': 'Текст третьего трека...',
        },
        {
            'title': 'Четвертый трек',
            'artist': 'АСИЯ',
            'order': 4,
            'lyrics': 'Текст четвертого трека...',
        },
        {
            'title': 'Пятый трек',
            'artist': 'АСИЯ',
            'order': 5,
            'lyrics': 'Текст пятого трека...',
        },
    ]

    # Удалить существующие тестовые треки
    Track.objects.all().delete()
    print('Удалены существующие треки')

    # Добавить новые
    created_count = 0
    for track_data in tracks_data:
        track = Track.objects.create(**track_data)
        created_count += 1
        print(f'Создан трек: {track}')

    print(f'\nВсего создано треков: {created_count}')
    print('\n⚠️  ВАЖНО: Треки созданы без аудио файлов и обложек!')
    print('Загрузите их через Django Admin: http://localhost:8000/admin')
    print('Раздел: MUSIC > Треки')

if __name__ == '__main__':
    add_test_tracks()
