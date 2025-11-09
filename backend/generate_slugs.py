#!/usr/bin/env python
"""
Скрипт для генерации slug'ов для существующих треков
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.music.models import Track, Album
from django.utils.text import slugify
from unidecode import unidecode


def generate_slugs():
    """Генерирует slug'и для всех треков и альбомов без slug'а"""

    # Треки
    tracks_updated = 0
    for track in Track.objects.filter(slug=''):
        base_slug = slugify(unidecode(track.title))
        slug = base_slug
        counter = 1

        while Track.objects.filter(slug=slug).exclude(pk=track.pk).exists():
            slug = f'{base_slug}-{counter}'
            counter += 1

        track.slug = slug
        track.save()
        tracks_updated += 1
        print(f'✓ Track: {track.title} -> {slug}')

    # Альбомы
    albums_updated = 0
    for album in Album.objects.filter(slug=''):
        base_slug = slugify(unidecode(album.title))
        slug = base_slug
        counter = 1

        while Album.objects.filter(slug=slug).exclude(pk=album.pk).exists():
            slug = f'{base_slug}-{counter}'
            counter += 1

        album.slug = slug
        album.save()
        albums_updated += 1
        print(f'✓ Album: {album.title} -> {slug}')

    print(f'\n✅ Обновлено треков: {tracks_updated}')
    print(f'✅ Обновлено альбомов: {albums_updated}')


if __name__ == '__main__':
    print('Генерация slug\'ов...\n')
    generate_slugs()
