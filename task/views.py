from rest_framework import viewsets
from .models import Job
from .serializers import JobSerializer
from .tasks import process_job  # Import the Celery task
from rest_framework.decorators import api_view
from rest_framework.response import Response

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def perform_create(self, serializer):
        job = serializer.save()  # Save the job to the database
        process_job.delay(job.id)  # Trigger Celery task asynchronously


@api_view(["GET"])
def job_progress(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        return Response({
            "status": job.status,
            "progress": job.progress,
            "output_file": job.output_file.url if job.output_file else None
        })
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)