from django.db import models


class Job(models.Model):
    title = models.CharField(max_length=100)
    submission_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, default="queued"
    )  # queued, in progress, completed, failed
    result = models.TextField(blank=True, null=True)  # store result or error message

    def __str__(self):
        return f"{self.user.username}'s job: {self.title}"
