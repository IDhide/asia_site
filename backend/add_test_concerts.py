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
            'date': date(2025, 12, 15),
            'city': 'МОСКВА',
            'venue': 'КРОКУС СИТИ ХОЛЛ',
            'ticket_url': 'https://example.com/tickets/1',
            'is_active': True
        },
        {
            'date': date(2025, 12, 20),
            'city': 'САНКТ-ПЕТЕРБУРГ',
            'venue': 'ЛЕДОВЫЙ ДВОРЕЦ',
            'ticket_url': 'https://example.com/tickets/2',
            'is_active': True
        },
        {
            'date': date(2026, 1, 10),
            'city': 'КАЗАНЬ',
            'venue': 'ТАТНЕФТЬ АРЕНА',
            'ticket_url': 'https://example.com/tickets/3',
            'is_active': True
        },
        {
            'date': date(2026, 1, 15),
            'city': 'ЕКАТЕРИНБУРГ',
            'venue': 'КРК "УРАЛЕЦ"',
            'ticket_url': 'https://example.com/tickets/4',
            'is_active': True
        },
        {
            'date': date(2026, 1, 22),
            'city': 'НОВОСИБИРСК',
            'venue': 'ЛЕДОВАЯ АРЕНА "СИБИРЬ"',
            'ticket_url': 'https://example.com/tickets/5',
            'is_active': True
        },
        {
            'date': date(2026, 2, 5),
            'city': 'КРАСНОДАР',
            'venue': 'БАСКЕТ-ХОЛЛ',
            'ticket_url': 'https://example.com/tickets/6',
            'is_active': True
        },
        {
            'date': date(2026, 2, 12),
            'city': 'РОСТОВ-НА-ДОНУ',
            'venue': 'ДВОРЕЦ СПОРТА',
            'ticket_url': 'https://example.com/tickets/7',
            'is_active': True
        },
        {
            'date': date(2026, 2, 20),
            'city': 'ВОРОНЕЖ',
            'venue': 'КОНЦЕРТНЫЙ ЗАЛ "АРЕНА"',
            'ticket_url': 'https://example.com/tickets/8',
            'is_active': True
        },
        {
            'date': date(2026, 3, 1),
            'city': 'НИЖНИЙ НОВГОРОД',
            'venue': 'КРК "НАГОРНЫЙ"',
            'ticket_url': 'https://example.com/tickets/9',
            'is_active': True
        },
        {
            'date': date(2026, 3, 8),
            'city': 'САМАРА',
            'venue': 'МТЛ АРЕНА',
            'ticket_url': 'https://example.com/tickets/10',
            'is_active': True
        },
        {
            'date': date(2026, 3, 15),
            'city': 'УФА',
            'venue': 'УФАРЕНА',
            'ticket_url': 'https://example.com/tickets/11',
            'is_active': True
        },
        {
            'date': date(2026, 3, 22),
            'city': 'ЧЕЛЯБИНСК',
            'venue': 'АРЕНА "ТРАКТОР"',
            'ticket_url': 'https://example.com/tickets/12',
            'is_active': True
        },
        {
            'date': date(2026, 4, 5),
            'city': 'ВЛАДИВОСТОК',
            'venue': 'ФЕТИСОВ АРЕНА',
            'ticket_url': 'https://example.com/tickets/13',
            'is_active': True
        },
        {
            'date': date(2026, 4, 12),
            'city': 'ХАБАРОВСК',
            'venue': 'ПЛАТИНУМ АРЕНА',
            'ticket_url': 'https://example.com/tickets/14',
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
