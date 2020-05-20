from django.contrib import messages
from django.contrib.auth import get_user_model
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView

from rest_framework import generics, permissions, serializers


class IndexView(TemplateView):
    """Boots up the view in production."""

    template_name = "index.html"

    # grab all server rendered messages
    def get_messages(self):
        return [
            {"message": message.message, "level": message.level}
            for message in messages.get_messages(self.request)
        ]

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data["init_json"] = {
            "current_user": UserSerializer(self.request.user).data,
            "messages": self.get_messages(),
        }
        return data


index_view = never_cache(ensure_csrf_cookie(IndexView.as_view()))


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("username", "email", "is_authenticated")


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permissions = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


current_user_view = CurrentUserView.as_view()
