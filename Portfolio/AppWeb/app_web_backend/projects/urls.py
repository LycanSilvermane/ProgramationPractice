from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, project_by_display_id

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='projects')

urlpatterns = [
    path('api/', include(router.urls)),
    path("projects/by-display/<int:display_id>/", project_by_display_id),
]