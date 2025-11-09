#!/usr/bin/env python
"""
Скрипт для добавления тестовых данных о концертах
Запуск: python add_test_concerts.py
"""
import os
import sys
import django
from datetime import date

# Настройка Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.music.models import Concert

def add_test_concerts():
    """Добавить тестовые концерты"""

    concerts_data = [
        {
            'date': date(2025, 9, 4),
            'city': 'МОСКВА',
            'venue': 'ЛЕДОВЫЙ ДВОРЕЦ "АЙСБЕРГ"',
            'ticket_url': 'https://example.com/tickets/1',
            'is_active': True
        },
        {
            'date': date(2025, 9, 4),
            'city': 'МОСКВА',
            'venue': 'ЛЕДОВЫЙ ДВОРЕЦ "АЙСБЕРГ"',
            'ticket_url': 'https://example.com/tickets/2',
            'is_active': True
        },
        {
            'date': date(2025, 9, 4),
            'city': 'МОСКВА',
            'venue': 'ЛЕДОВЫЙ ДВОРЕЦ "АЙСБЕРГ"',
            'ticket_url': 'https://example.com/tickets/3',
            'is_active': True
        },
        {
            'date': date(2025, 9, 4),
            'city': 'МОСКВА',
            'venue': 'ЛЕДОВЫЙ ДВОРЕЦ "АЙСБЕРГ" ПУЛ...',
            'ticket_url': 'https://example.com/tickets/4',
            'is_active': True
        },
        {
            'date': date(2025, 9, 4),
            'city': 'МОСКВА',
            'venue': 'ЛЕДОВЫЙ ДВОРЕЦ "АЙСБЕРГ"',
            'ticket_url': 'https://example.com/tickets/5',
            'is_active': True
        },
        {
            'date': date(2025, 9, 4),
            'city': 'МОСКВА',
            'venue': 'ЛЕДОВЫЙ ДВОРЕЦ "АЙСБЕРГ"',
            'ticket_url': 'https://example.com/tickets/6',
            'is_active': True
        },
        {
            'date': date(2025, 9, 4),
            'city': 'МОСКВА',
            'venue': 'ЛЕДОВЫЙ ДВОРЕЦ "АЙСБЕРГ"',
            'ticket_url': 'https://example.com/tickets/7',
            'is_active': True
        },
        {
            'date': date(2025, 9, 4),
            'city': 'МОСКВА',
            'venue': 'ЛЕДОВЫЙ ДВОРЕЦ "АЙСБЕРГ"',
            'ticket_url': 'https://example.com/tickets/8',
            'is_active': True
        },
    ]

    # Удалить существующие тестовые концерты
    Concert.objects.all().delete()
    print('Удалены существующие концерты')

    # Добавить новые
    created_count = 0
    for concert_data in concerts_data:
        concert = Concert.objects.create(**concert_data)
        created_count += 1
        print(f'Создан концерт: {concert}')

    print(f'\nВсего создано концертов: {created_count}')
    print('Готово! Теперь концерты доступны в админке и на фронтенде.')

if __name__ == '__main__':
    add_test_concerts()
