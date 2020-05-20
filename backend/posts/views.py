from rest_framework import viewsets, permissions

from .models import Post
from .permissions import IsPostAuthorOrReadOnly
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):

    queryset = Post.objects.select_related("author").order_by("-created")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsPostAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
