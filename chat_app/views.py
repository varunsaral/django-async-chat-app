import os

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from pytube import YouTube,Search


def index(request):
    return render(request, "chat_app/index.html")


def room(request, room_name):
    return render(request, "chat_app/room.html", {"room_name": room_name})


def download_audio(request,video_id):
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    yt = YouTube(video_url)
    audio_stream = yt.streams.filter(only_audio=True).first()
    audio_filename = audio_stream.default_filename

    audio_stream.download(output_path=os.path.join(settings.MEDIA_ROOT, "audio"))
    audio_path = f"/media/audio/{audio_filename}"
    return JsonResponse({'audio_path': audio_path})


def play_video(request, video_id):
    audio_filename = download_audio(request,video_id)
    context = {"audio_filename": audio_filename, "MEDIA_URL": settings.MEDIA_URL}

    return render(request, "chat_app/play.html", context=context)

def search_youtube(request):
    if request.method == "GET":
        search_query = request.GET.get("query")
        if search_query:
            try:
                # Use pytube to search for videos
                results = Search(search_query)
                results = results.results
                search_results = [
                    {
                        "title": result._title,
                        "url": result.watch_url,
                        "video_id": result.video_id,
                    }
                    for result in results
                ]
                return JsonResponse({"results": search_results})
            except Exception as e:
                return JsonResponse({"error": "An error occurred while searching."})
        else:
            return JsonResponse({"error": "Invalid search query."})

def music(request):
    return render(request, "chat_app/music.html")
