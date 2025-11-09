from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.music.models import Track, Album, Concert
from apps.shop.models import Product, ProductImage


@api_view(['GET'])
def get_all_data(request):
    """
    Единый API endpoint для получения всех данных приложения.
    Возвращает треки, товары и концерты одним запросом.
    """

    # Треки
    tracks = Track.objects.filter(is_published=True).select_related('album').order_by('order', 'id')
    tracks_data = []
    for track in tracks:
        tracks_data.append({
            'id': track.id,
            'slug': track.slug,
            'title': track.title,
            'artist': track.artist,
            'year': track.year,
            'album': {
                'id': track.album.id,
                'slug': track.album.slug,
                'title': track.album.title,
            } if track.album else None,
            'cover': request.build_absolute_uri(track.cover.url) if track.cover else None,
            'audio': request.build_absolute_uri(track.audio.url) if track.audio else None,
            'lyrics': track.lyrics,
            'order': track.order,
            'created_at': track.created_at.isoformat() if track.created_at else None,
            'updated_at': track.updated_at.isoformat(),
        })

    # Товары
    products = Product.objects.all()
    products_data = []
    for product in products:
        # Получаем изображения для каждого товара
        images = ProductImage.objects.filter(product=product).order_by('id')
        images_data = []
        for img in images:
            images_data.append({
                'id': img.id,
                'image': request.build_absolute_uri(img.image.url),
                'alt_text': img.alt or '',
                'order': 0,
            })

        products_data.append({
            'id': product.id,
            'title': product.title,
            'slug': product.slug,
            'price': float(product.price),
            'short_description': product.short or '',
            'description': product.description,
            'cover': request.build_absolute_uri(product.cover.url) if product.cover else None,
            'images': images_data,
        })

    # Альбомы
    albums = Album.objects.filter(is_published=True).order_by('-year', 'order', 'id')
    albums_data = []
    for album in albums:
        albums_data.append({
            'id': album.id,
            'slug': album.slug,
            'title': album.title,
            'artist': album.artist,
            'year': album.year,
            'cover': request.build_absolute_uri(album.cover.url) if album.cover else None,
            'description': album.description,
            'order': album.order,
            'created_at': album.created_at.isoformat(),
            'updated_at': album.updated_at.isoformat(),
        })

    # Концерты
    concerts = Concert.objects.filter(is_active=True).order_by('date')
    concerts_data = []
    for concert in concerts:
        concerts_data.append({
            'id': concert.id,
            'date': concert.date.isoformat(),
            'city': concert.city,
            'venue': concert.venue,
            'ticket_url': concert.ticket_url,
            'is_active': concert.is_active,
        })

    return Response({
        'tracks': tracks_data,
        'albums': albums_data,
        'products': products_data,
        'concerts': concerts_data,
    })
