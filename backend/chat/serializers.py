from rest_framework import serializers

from .models import ChatMessage, Thread

from users.models import User

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = (
                'thread',
                'user',
                'timestamp',
                'message',
                'read',
                'get_avatar',
                'pk',
        )


class ThreadSerializer(serializers.ModelSerializer):
    receiver = serializers.IntegerField()
    receiver_avatar = serializers.CharField()
    receiver_username = serializers.CharField()
    

    class Meta:
        model = Thread
        fields = (
                'creation_date',
                'last_updated',
                'pk',
                'receiver',
                'receiver_avatar',
                'receiver_username',
                'last_updated',
        )


class ThreadCreateSerializer(serializers.ModelSerializer):
    user1_pk = serializers.IntegerField(write_only=True)
    user2_pk = serializers.IntegerField(write_only=True)

    class Meta:
        model = Thread
        fields = (
                'user1_pk',
                'user2_pk',
        )

    def create(self, validated_data):
        user1_pk = validated_data.pop('user1_pk', None)
        user2_pk = validated_data.pop('user2_pk', None)
        user1 = User.objects.get(pk=user1_pk)
        user2 = User.objects.get(pk=user2_pk)
        instance = self.Meta.model(user1=user1, user2=user2)
        instance.save()
        return instance
