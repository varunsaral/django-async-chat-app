import json
from channels.db import database_sync_to_async
from django.http import HttpRequest
from .views import search_youtube, download_audio
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        json_data = json.loads(text_data)
        message = json_data["message"]
        if message.startswith("!search"):
            query = message[8:]
            results = await self.call_view(search_youtube, query=query)
            text_data=json.dumps({
                'results': results['results'][:5]
            })
            await self.channel_layer.group_send(
                self.room_group_name,{"type": "chat.special.search","message": text_data}
            ) 
        elif message.startswith("!play"):
            index = int(message[6:]) - 1
            video_id = self.search_results[index]["video_id"] 
            text_data=json.dumps({
                'video_id': video_id
            })
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat.special.play", "message": text_data}
            ) 
        else:
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat.message", "message": message}
            )

    async def chat_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"type": "message", "message": message}))
    
    async def chat_special_search(self,event):
        message = json.loads(event["message"])
        self.search_results = message["results"]
        print(self.search_results)
        await self.send(text_data=json.dumps({"type": "special_command_search", "message": message["results"]}))
    
    async def chat_special_play(self,event):
        message = json.loads(event["message"])
        await self.send(text_data=json.dumps({"type":"special_command_play","message": message["video_id"]}))
        
    @database_sync_to_async
    def call_view(self, view, **kwargs):
        request = HttpRequest()
        request.method = 'GET'
        request.GET = kwargs
        response = view(request)
        return json.loads(response.content)