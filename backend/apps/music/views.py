from django.shortcuts import render
from .models import Track

def playlist(request):
    tracks = Track.objects.all()
    return render(request, 'music/playlist.html', {'tracks': tracks})
