from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from .models import User
from .serializers import TokenAndUserPairSerializer, UserSerializer
from .serializers import UserSerializerWithToken

from rest_framework_simplejwt.views import TokenObtainPairView


#class UserDetail(RetrieveAPIView):
#    permission_classes = (IsAuthenticated, )
#    queryset = User.objects.filter(active=True)
#    serializer_class = PostSerializer
#    lookup_field = 'id'

@api_view(['GET'])
def current_user(request):
    """
    Get current user by their token and return data
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class TokenAndUserPairView(TokenObtainPairView):
    """
    Same as TokenObtainPairView but add a user.pk into the data
    """
    serializer_class = TokenAndUserPairSerializer


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have
    a get method here too, for retrieving a list of all User objects.
    """
    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        users = User.objects.exclude(email=request.user.email)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
