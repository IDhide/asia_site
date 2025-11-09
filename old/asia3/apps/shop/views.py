from django.shortcuts import render, get_object_or_404
from .models import Product
def product_list(request):
    items = Product.objects.filter(is_active=True)
    return render(request, 'shop/product_list.html', {'items': items})

def product_detail(request, slug):
    item = get_object_or_404(Product, slug=slug, is_active=True)
    return render(request, 'shop/product_detail.html', {'item': item})
