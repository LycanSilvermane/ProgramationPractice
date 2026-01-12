from django.db import models
from django.contrib.auth.models import User
from projects.models import Project

class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('progress', 'In Progress'),
        ('done', 'Done'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pendiente'),('in_progress', 'En progreso'),('done','Completada')], default='pending')
    priority = models.IntegerField(default=1)
    due_date = models.DateField(null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
