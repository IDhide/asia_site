from django.db import models

class Track(models.Model):
    title = models.CharField('Название', max_length=150)
    artist = models.CharField('Исполнитель', max_length=150, default='АСИЯ')
    order = models.PositiveIntegerField('Порядок', default=0)
    audio = models.FileField('Аудио', upload_to='tracks/')
    cover = models.ImageField('Обложка', upload_to='tracks/', blank=True, null=True)
    lyrics = models.TextField('Текст', blank=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Трек'
        verbose_name_plural = 'Треки'

    def __str__(self):
        return f'{self.title} — {self.artist}'
