from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Project
from .serializers import ProjectSerializer
from .permissions import IsOwnerOrAdmin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    lookup_field = 'display_id'

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser or user.groups.filter(name="Admin").exists():
            return Project.objects.all()
        
        return Project.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        last_project = (
            Project.objects.filter(owner=self.request.user).order_by("-display_id").first()
        )

        next_display_id = 1 if not last_project else last_project.display_id + 1        
        serializer.save(owner=self.request.user, display_id=next_display_id)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def project_by_display_id(request, display_id):
        project = get_object_or_404(
            Project,
            owner=request.user,
            display_id=display_id
        )
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

