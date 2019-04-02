from django.shortcuts import render, get_object_or_404
from django.db.models import Case, When

from rest_framework import status
from rest_framework.generics import ListCreateAPIView, ListAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ChatMessage, Thread
from .serializers import ChatMessageSerializer, ThreadSerializer
from .serializers import ThreadCreateSerializer

from users.models import User

import logging

logger = logging.getLogger('testing')

# Create your views here.
class ChatMessageList(ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        queryset = ChatMessage.objects.all()
        thread_id = self.kwargs['thread_id']
        if thread_id:
            thread = get_object_or_404(Thread, pk=thread_id)
            if thread.is_user_allowed(self.request.user.pk):
                queryset = queryset.filter(thread__pk=thread_id)
                return queryset
            else:
                raise PermissionDenied

        return None


class ThreadList(ListAPIView):
    serializer_class = ThreadSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        if self.request.user:
            return Thread.objects.by_user(self.request.user).annotate(
                    receiver=Case(
                        When(user1=self.request.user, then='user2'),
                        When(user2=self.request.user, then='user1')),
                    receiver_avatar=Case(
                        When(user1=self.request.user, then='user2__avatar'),
                        When(user2=self.request.user, then='user1__avatar')),
                    receiver_username=Case(
                        When(user1=self.request.user, then='user2__username'),
                        When(user2=self.request.user, then='user1__username'))
                    
                    )
        return None


@api_view(['GET', 'POST'])
def get_or_create_thread(request, user_pk):
    try:
        user = User.objects.get(pk=user_pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if Thread.objects.by_users(user, request.user).exists():
        thread = Thread.objects.by_users(user, request.user).annotate(
                    receiver=Case(
                        When(user1=request.user, then='user2'),
                        When(user2=request.user, then='user1')),
                    receiver_avatar=Case(
                        When(user1=request.user, then='user2__avatar'),
                        When(user2=request.user, then='user1__avatar')),
                    receiver_username=Case(
                        When(user1=request.user, then='user2__username'),
                        When(user2=request.user, then='user1__username'))
                    ).first()
    else:
        if request.method == 'POST':
            serializer = ThreadCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ThreadSerializer(thread)
        return Response(serializer.data)


    return Response(status=status.HTTP_404_NOT_FOUND)