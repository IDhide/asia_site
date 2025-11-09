from django.urls import path
from .views import playlist
from .api_views import track_list, track_detail, album_list, album_detail

urlpatterns = [
    path('', playlist, name='playlist'),

    # API endpoints
    path('api/tracks/', track_list, name='api_track_list'),
    path('api/tracks/<slug:slug>/', track_detail, name='api_track_detail'),
    path('api/albums/', album_list, name='api_album_list'),
    path('api/albums/<slug:slug>/', album_detail, name='api_album_detail'),
]
