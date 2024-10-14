from django.db import models


class Job(models.Model):
    submission_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, default="queued"
    )  # queued, in progress, completed, failed
    result = models.TextField(blank=True, null=True)  # store result or error message
    input_file = models.FileField(upload_to="uploads/")  # Store the uploaded file
    output_file = models.FileField(upload_to="converted/", blank=True, null=True)
    conversion_format = models.CharField(max_length=10)  # e.g., 'jpg', 'mp4'
    progress = models.IntegerField(default=0)  # Track progress (0-100)

    def __str__(self):
        return f"{self.id} - {self.status}"
