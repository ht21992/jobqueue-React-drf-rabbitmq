from celery import shared_task
from .models import Job
import time  # Simulating a long-running task


@shared_task
def process_job(job_id):
    job = Job.objects.get(id=job_id)
    job.status = "in progress"
    job.save()

    # Simulating a long task
    time.sleep(10)  # Replace with your actual processing logic

    job.status = "completed"
    job.result = "Job completed successfully!"  # Replace with actual result
    job.save()
