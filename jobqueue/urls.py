from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from task.views import job_progress
# get_task_progress

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/jobs/<int:job_id>/progress/", job_progress, name="job-progress"),
    # path("api/task-progress/<str:task_id>/", get_task_progress),
    path("api/", include("task.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
