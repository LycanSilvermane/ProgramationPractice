from rest_framework.permissions import BasePermission

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        
        if request.user.groups.filter(name="Admin").exists():
            return True
        
        return obj.owner == request.user