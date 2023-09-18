import os

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("chat/<str:room_name>/", views.room, name="room"),
    path("search-youtube/", views.search_youtube, name="search_youtube"),
    path("download/<str:video_id>/", views.download_audio, name="download_audio"),
    path("music/", views.music, name="music")
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
