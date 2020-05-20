from django.contrib import admin
from django.urls import include, path, re_path

from rest_framework import routers

from .posts.views import PostViewSet
from .views import current_user_view, index_view

router = routers.DefaultRouter()
router.register("posts", PostViewSet)

urlpatterns = [
    path("api/me/", current_user_view),
    path("api/auth/", include("allauth.urls")),
    path("api/", include(router.urls)),
    path("admin/", admin.site.urls),
    # let vue-router handle any other routes internally
    re_path(r"^.*", index_view),
]
