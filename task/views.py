from rest_framework import viewsets
from .models import Job
from .serializers import JobSerializer
from .tasks import process_job  # Import the task


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def perform_create(self, serializer):
        job = serializer.save()  # Save the job to the database
        process_job.delay(job.id)  # Call the Celery task asynchronously
