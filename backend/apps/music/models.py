from django.db import models
from django.utils.text import slugify
from unidecode import unidecode


class Album(models.Model):
    """Модель альбома"""
    title = models.CharField('Название', max_length=200)
    slug = models.SlugField('URL', max_length=250, unique=True, blank=True)
    artist = models.CharField('Исполнитель', max_length=150, default='АСИЯ')
    year = models.PositiveIntegerField('Год выпуска', null=True, blank=True)
    cover = models.ImageField('Обложка', upload_to='albums/', blank=True, null=True)
    description = models.TextField('Описание', blank=True)
    order = models.PositiveIntegerField('Порядок', default=0)
    is_published = models.BooleanField('Опубликован', default=True)
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлен', auto_now=True)

    class Meta:
        ordering = ['-year', 'order', 'id']
        verbose_name = 'Альбом'
        verbose_name_plural = 'Альбомы'

    def __str__(self):
        return f'{self.title} ({self.year})' if self.year else self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            # Транслитерация для кириллицы
            base_slug = slugify(unidecode(self.title))
            self.slug = base_slug

            # Проверка уникальности
            counter = 1
            while Album.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{base_slug}-{counter}'
                counter += 1

        super().save(*args, **kwargs)


class Track(models.Model):
    """Модель трека"""
    title = models.CharField('Название', max_length=150)
    slug = models.SlugField('URL', max_length=250, unique=True, blank=True)
    artist = models.CharField('Исполнитель', max_length=150, default='АСИЯ')
    album = models.ForeignKey(
        Album,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tracks',
        verbose_name='Альбом'
    )
    year = models.PositiveIntegerField('Год выпуска', null=True, blank=True)
    order = models.PositiveIntegerField('Порядок', default=0)
    audio = models.FileField('Аудио', upload_to='tracks/')
    cover = models.ImageField('Обложка', upload_to='tracks/', blank=True, null=True)
    lyrics = models.TextField('Текст', blank=True)
    is_published = models.BooleanField('Опубликован', default=True)
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлен', auto_now=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Трек'
        verbose_name_plural = 'Треки'

    def __str__(self):
        return f'{self.title} — {self.artist}'

    def save(self, *args, **kwargs):
        if not self.slug:
            # Транслитерация для кириллицы
            base_slug = slugify(unidecode(self.title))
            self.slug = base_slug

            # Проверка уникальности
            counter = 1
            while Track.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{base_slug}-{counter}'
                counter += 1

        super().save(*args, **kwargs)


class Concert(models.Model):
    date = models.DateField('Дата концерта')
    city = models.CharField('Город', max_length=100)
    venue = models.CharField('Место проведения', max_length=200)
    ticket_url = models.URLField('Ссылка на билеты')
    is_active = models.BooleanField('Активен', default=True)
    created_at = models.DateTimeField('Создан', auto_now_add=True)

    class Meta:
        ordering = ['date']
        verbose_name = 'Концерт'
        verbose_name_plural = 'Концерты'

    def __str__(self):
        return f'{self.date.strftime("%d.%m.%Y")} — {self.city}, {self.venue}'
