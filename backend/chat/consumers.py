import asyncio
import json

from datetime import datetime

from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from channels.exceptions import StopConsumer

from users.models import User

from .models import Thread, ChatMessage
from .serializers import ChatMessageSerializer

import logging

logger = logging.getLogger('testing')

class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print("connected", event)
        thread_pk = self.scope['url_route']['kwargs']['thread_id']
        thread_obj = await self.get_thread(thread_pk)
        self.thread_obj = thread_obj
        chat_room = "thread{}".format(thread_obj.id)
        self.chat_room = chat_room
        if self.scope['user'].id == None:
            raise StopConsumer

        self.user = self.scope['user']

        await self.channel_layer.group_add(
                chat_room,
                self.channel_name
                )
        await self.send({
            "type": "websocket.accept"
            })


    async def websocket_receive(self, event):
        print("receive", event)
        front_text = event.get('text', None)
        if front_text:
            loaded_dict_data = json.loads(front_text)
            msg = loaded_dict_data.get('message')

            user = self.user
            if user.is_authenticated:
                username = user.username
            else:
                username = 'default'

            if not msg:
                return

            new_message = await self.create_chat_message(msg)
            serializer = ChatMessageSerializer(new_message)
            myResponse = serializer.data
            #myResponse = {
            #        'message': msg,
            #        'message_pk': new_message.pk,
            #        'username': username,
            #}

            await self.channel_layer.group_send(
                    self.chat_room,
                    {
                        'type': 'chat_message',
                        'text': json.dumps(myResponse)
                    }
            )

    async def chat_message(self, event):
        await self.send({
            "type": "websocket.send",
            "text": event['text']
            })


    async def websocket_disconnect(self, event):
        print('disconnected', event)
        raise StopConsumer


    @database_sync_to_async
    def get_thread(self, thread_pk):
        return Thread.objects.get(pk=thread_pk)

    @database_sync_to_async
    def create_chat_message(self, msg):
        thread_obj = self.thread_obj
        me = self.scope['user']

        return ChatMessage.objects.create(thread=thread_obj, user=me,
                                            message=msg)
