from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Track, Album


@api_view(['GET'])
def track_list(request):
    """API endpoint для получения списка треков"""
    tracks = Track.objects.filter(is_published=True).select_related('album')

    data = []
    for track in tracks:
        track_data = {
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
            'created_at': track.created_at.isoformat(),
            'updated_at': track.updated_at.isoformat(),
        }
        data.append(track_data)

    return Response(data)


@api_view(['GET'])
def track_detail(request, slug):
    """API endpoint для получения детальной информации о треке"""
    track = get_object_or_404(Track, slug=slug, is_published=True)

    track_data = {
        'id': track.id,
        'slug': track.slug,
        'title': track.title,
        'artist': track.artist,
        'year': track.year,
        'album': {
            'id': track.album.id,
            'slug': track.album.slug,
            'title': track.album.title,
            'year': track.album.year,
            'cover': request.build_absolute_uri(track.album.cover.url) if track.album.cover else None,
        } if track.album else None,
        'cover': request.build_absolute_uri(track.cover.url) if track.cover else None,
        'audio': request.build_absolute_uri(track.audio.url) if track.audio else None,
        'lyrics': track.lyrics,
        'order': track.order,
        'created_at': track.created_at.isoformat(),
        'updated_at': track.updated_at.isoformat(),
    }

    return Response(track_data)


@api_view(['GET'])
def album_list(request):
    """API endpoint для получения списка альбомов"""
    albums = Album.objects.filter(is_published=True).prefetch_related('tracks')

    data = []
    for album in albums:
        album_data = {
            'id': album.id,
            'slug': album.slug,
            'title': album.title,
            'artist': album.artist,
            'year': album.year,
            'cover': request.build_absolute_uri(album.cover.url) if album.cover else None,
            'description': album.description,
            'order': album.order,
            'tracks_count': album.tracks.filter(is_published=True).count(),
            'created_at': album.created_at.isoformat(),
            'updated_at': album.updated_at.isoformat(),
        }
        data.append(album_data)

    return Response(data)


@api_view(['GET'])
def album_detail(request, slug):
    """API endpoint для получения детальной информации об альбоме"""
    album = get_object_or_404(Album, slug=slug, is_published=True)

    # Получаем треки альбома
    tracks = album.tracks.filter(is_published=True)
    tracks_data = []
    for track in tracks:
        track_data = {
            'id': track.id,
            'slug': track.slug,
            'title': track.title,
            'artist': track.artist,
            'year': track.year,
            'cover': request.build_absolute_uri(track.cover.url) if track.cover else None,
            'audio': request.build_absolute_uri(track.audio.url) if track.audio else None,
            'lyrics': track.lyrics,
            'order': track.order,
        }
        tracks_data.append(track_data)

    album_data = {
        'id': album.id,
        'slug': album.slug,
        'title': album.title,
        'artist': album.artist,
        'year': album.year,
        'cover': request.build_absolute_uri(album.cover.url) if album.cover else None,
        'description': album.description,
        'order': album.order,
        'tracks': tracks_data,
        'created_at': album.created_at.isoformat(),
        'updated_at': album.updated_at.isoformat(),
    }

    return Response(album_data)
