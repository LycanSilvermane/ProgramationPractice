from rest_framework import generics, permissions, status 
from .serializers import RegisterSerializer, UserAdminSerializer, AdminUserRoleSerializer
from django.contrib.auth.models import User, Group
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import viewsets


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):

        user = serializer.save()

        group, created = Group.objects.get_or_create(name="User")
        user.groups.add(group)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "groups": [g.name for g in user.groups.all()],
            "is_superuser": user.is_superuser
        })

class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return AdminUserRoleSerializer
        return UserAdminSerializer