from django.urls import path
from . import views
from . import api_views

urlpatterns = [
    path('', views.product_list, name='product_list'),
    path('api/products/', api_views.product_list, name='api_product_list'),
    path('api/products/<slug:slug>/', api_views.product_detail, name='api_product_detail'),
    path('<slug:slug>/', views.product_detail, name='product_detail'),
]
