from django.conf import settings
from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=300)
    url = models.URLField(null=True, blank=True)
    description = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
