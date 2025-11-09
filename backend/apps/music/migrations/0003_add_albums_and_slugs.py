# Generated migration for adding albums and slugs

from django.db import migrations, models
import django.db.models.deletion
from django.utils.text import slugify
from unidecode import unidecode


def generate_slugs(apps, schema_editor):
    """Генерирует slug'и для существующих треков"""
    Track = apps.get_model('music', 'Track')

    for track in Track.objects.all():
        if not track.slug:
            base_slug = slugify(unidecode(track.title))
            slug = base_slug
            counter = 1

            while Track.objects.filter(slug=slug).exclude(pk=track.pk).exists():
                slug = f'{base_slug}-{counter}'
                counter += 1

            track.slug = slug
            track.save()


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0002_concert'),
    ]

    operations = [
        # Создаем модель Album
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Название')),
                ('slug', models.SlugField(blank=True, max_length=250, unique=True, verbose_name='URL')),
                ('artist', models.CharField(default='АСИЯ', max_length=150, verbose_name='Исполнитель')),
                ('year', models.PositiveIntegerField(blank=True, null=True, verbose_name='Год выпуска')),
                ('cover', models.ImageField(blank=True, null=True, upload_to='albums/', verbose_name='Обложка')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
                ('is_published', models.BooleanField(default=True, verbose_name='Опубликован')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлен')),
            ],
            options={
                'verbose_name': 'Альбом',
                'verbose_name_plural': 'Альбомы',
                'ordering': ['-year', 'order', 'id'],
            },
        ),

        # Добавляем поля к Track (сначала без unique constraint)
        migrations.AddField(
            model_name='track',
            name='slug',
            field=models.SlugField(blank=True, max_length=250, verbose_name='URL'),
        ),
        migrations.AddField(
            model_name='track',
            name='year',
            field=models.PositiveIntegerField(blank=True, null=True, verbose_name='Год выпуска'),
        ),
        migrations.AddField(
            model_name='track',
            name='is_published',
            field=models.BooleanField(default=True, verbose_name='Опубликован'),
        ),
        migrations.AddField(
            model_name='track',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Создан', null=True),
        ),
        migrations.AddField(
            model_name='track',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Обновлен'),
        ),

        # Генерируем slug'и для существующих треков
        migrations.RunPython(generate_slugs, migrations.RunPython.noop),

        # Теперь делаем slug уникальным
        migrations.AlterField(
            model_name='track',
            name='slug',
            field=models.SlugField(blank=True, max_length=250, unique=True, verbose_name='URL'),
        ),

        # Добавляем связь с альбомом
        migrations.AddField(
            model_name='track',
            name='album',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='tracks',
                to='music.album',
                verbose_name='Альбом'
            ),
        ),
    ]
