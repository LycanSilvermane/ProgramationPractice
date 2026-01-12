from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Task, Project
from .serializers import TaskSerializer
from .permissions import IsOwner
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response 

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['project']

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get("project")

        if not user.is_superuser:
            queryset = Task.objects.filter(project__owner=user)
        else:
            queryset = Task.objects.all()

        if project_id:
            try:
                project_id = int(project_id)
            except (TypeError, ValueError):
                return Task.objects.none()
            
            project = Project.objects.filter(id=project_id).first()
            if not project:
                return Task.objects.none()
            
            if not user.is_superuser and project.owner != user:
                return Task.objects.none()
            
            queryset = queryset.filter(project=project)
        
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
    def perform_create(self, serializer):
        project = serializer.validated_data["project"]

        if project.owner != self.request.user:
            raise PermissionDenied(
                "No puedes crear tareas en proyectos ajenos"
            )

        serializer.save(
            assigned_to=self.request.user
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
