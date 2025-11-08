from django.db import models
from django.utils.text import slugify

class Product(models.Model):
    title = models.CharField('Название', max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    price = models.PositiveIntegerField('Цена, ₽')
    short = models.CharField('Короткое описание', max_length=200, blank=True)
    description = models.TextField('Описание', blank=True)
    cover = models.ImageField('Обложка', upload_to='products/')
    is_active = models.BooleanField('Активен', default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товара'

    def __str__(self):
        return self.title

    @property
    def primary_image(self):
        """Картинка для карточки: cover или первая из галереи."""
        if self.cover:
            return self.cover
        first = self.images.first()
        return first.image if first else None

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            i = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                i += 1
                slug = f"{base}-{i}"
            self.slug = slug
        super().save(*args, **kwargs)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt = models.CharField(max_length=120, blank=True)

    class Meta:
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товара'
