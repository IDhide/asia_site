from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product, ProductImage


@api_view(['GET'])
def product_list(request):
    """API endpoint для получения списка товаров"""
    products = Product.objects.all().order_by('-created_at')

    data = []
    for product in products:
        product_data = {
            'id': product.id,
            'title': product.title,
            'slug': product.slug,
            'price': float(product.price),
            'short_description': product.short_description,
            'cover': request.build_absolute_uri(product.cover.url) if product.cover else None,
            'created_at': product.created_at.isoformat() if product.created_at else None,
        }
        data.append(product_data)

    return Response(data)


@api_view(['GET'])
def product_detail(request, slug):
    """API endpoint для получения детальной информации о товаре"""
    try:
        product = Product.objects.get(slug=slug)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    # Получаем все изображения товара
    images = ProductImage.objects.filter(product=product).order_by('order')
    images_data = []
    for img in images:
        images_data.append({
            'id': img.id,
            'image': request.build_absolute_uri(img.image.url),
            'alt_text': img.alt_text,
            'order': img.order,
        })

    product_data = {
        'id': product.id,
        'title': product.title,
        'slug': product.slug,
        'price': float(product.price),
        'short_description': product.short_description,
        'description': product.description,
        'cover': request.build_absolute_uri(product.cover.url) if product.cover else None,
        'images': images_data,
        'created_at': product.created_at.isoformat() if product.created_at else None,
    }

    return Response(product_data)
