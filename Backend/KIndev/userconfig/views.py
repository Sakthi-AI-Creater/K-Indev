from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics, serializers
from django.utils.decorators import method_decorator
from .serializers import UserSerializer, UpdateUserSerializer, CreateUserSerializer
from rest_framework.decorators import api_view , parser_classes, permission_classes
from .models import CustomUser
from .serializers import UserSerializer
class LoginView(TokenObtainPairView):
    pass

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class ListUsersView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    def get_serializer_context(self):
        return {'request': self.request}
    
@api_view(['DELETE'])
def delete_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    user.delete()
    return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CreateUserSerializer


class UpdateUserView(APIView):
    def put(self, request, user_id):
        user = get_object_or_404(CustomUser, id=user_id)
        serializer = UpdateUserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
def remove_profile_image(request, user_id):
    user = get_object_or_404(CustomUser, pk=user_id)
    if user.profile_image:
        user.profile_image.delete(save=False)  # delete file
        user.profile_image = None
        user.save()
    return Response({'message': 'Image removed'}, status=200)