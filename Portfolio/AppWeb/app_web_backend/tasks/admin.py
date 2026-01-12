from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "status", "project", "assigned_to", "created_at")
    list_filter = ("assigned_to",)
    search_fields = ("title", "assigned_to")
