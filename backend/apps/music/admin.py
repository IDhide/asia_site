from django.contrib import admin
from .models import Track, Album, Concert


class TrackInline(admin.TabularInline):
    """Inline для треков в альбоме"""
    model = Track
    extra = 0
    fields = ('title', 'slug', 'order', 'audio', 'is_published')
    readonly_fields = ('slug',)


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'year', 'order', 'tracks_count', 'is_published')
    list_editable = ('order', 'is_published')
    list_filter = ('is_published', 'year')
    search_fields = ('title', 'artist')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [TrackInline]

    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'slug', 'artist', 'year')
        }),
        ('Медиа', {
            'fields': ('cover', 'description')
        }),
        ('Настройки', {
            'fields': ('order', 'is_published')
        }),
    )

    def tracks_count(self, obj):
        return obj.tracks.count()
    tracks_count.short_description = 'Треков'


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'year', 'order', 'is_published')
    list_editable = ('order', 'is_published')
    list_filter = ('is_published', 'album', 'year')
    search_fields = ('title', 'artist', 'lyrics')
    prepopulated_fields = {'slug': ('title',)}

    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'slug', 'artist', 'album', 'year')
        }),
        ('Медиа', {
            'fields': ('cover', 'audio')
        }),
        ('Текст песни', {
            'fields': ('lyrics',),
            'classes': ('collapse',)
        }),
        ('Настройки', {
            'fields': ('order', 'is_published')
        }),
    )


@admin.register(Concert)
class ConcertAdmin(admin.ModelAdmin):
    list_display = ('date', 'city', 'venue', 'is_active')
    list_filter = ('is_active', 'city')
    list_editable = ('is_active',)
    search_fields = ('city', 'venue')
    date_hierarchy = 'date'
