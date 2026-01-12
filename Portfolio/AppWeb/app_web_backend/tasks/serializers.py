from rest_framework import serializers
from .models import Task, Project  

class TaskSerializer(serializers.ModelSerializer):
    
    project = serializers.PrimaryKeyRelatedField(  
        queryset=Project.objects.none()
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'status', 'project', 'assigned_to']
        read_only_fields = ['id', 'created_at', 'assigned_to', 'project']

    def __init__ (self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            if request.user.is_superuser:
                self.fields["project"].queryset = Project.objects.all()
            else:
                self.fields["project"].queryset = Project.objects.filter(owner=request.user)

