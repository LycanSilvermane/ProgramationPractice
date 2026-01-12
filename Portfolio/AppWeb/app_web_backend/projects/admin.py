from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "display_id", "name", "owner", "created_at")
    list_filter = ("owner",)
    search_fields = ("name",)
