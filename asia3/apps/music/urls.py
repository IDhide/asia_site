from django.urls import path
from .views import playlist

urlpatterns = [ path('', playlist, name='playlist') ]
