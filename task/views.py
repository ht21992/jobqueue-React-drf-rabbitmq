from rest_framework import viewsets
from .models import Job
from .serializers import JobSerializer
from .tasks import process_job  # Import the Celery task
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job = serializer.save()

        # Trigger the Celery task and store the task ID
        task = process_job.apply_async(args=(job.id,))
        job.task_id = task.id  # Save the task ID in the job model
        job.save()

        updated_serializer = self.get_serializer(job)

        return Response(updated_serializer.data, status=status.HTTP_201_CREATED)


# @api_view(["GET"])
# def job_progress(request, job_id):
#     try:
#         job = Job.objects.get(id=job_id)
#         return Response(
#             {
#                 "status": job.status,
#                 "progress": job.progress,
#                 "output_file": job.output_file.url if job.output_file else None,
#             }
#         )
#     except Job.DoesNotExist:
#         return Response({"error": "Job not found"}, status=404)
