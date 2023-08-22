import json

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
        if json_data["type"] == "message":
            message = json_data["message"]
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat.message", "message": message}
            )
        elif json_data["type"] == "count":
            message = json_data["count"]
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "increase_count", "count": message}
            )

    async def chat_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"type": "message", "message": message}))

    async def increase_count(self, event):
        count = event["count"]
        await self.send(text_data=json.dumps({"type": "count", "message": int(count)}))
