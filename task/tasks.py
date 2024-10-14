from celery import shared_task, current_task
from .models import Job
from PIL import Image
import os
from moviepy.editor import VideoFileClip
import time


@shared_task(bind=True)
def process_job(self, job_id):
    job = Job.objects.get(id=job_id)
    job.status = "in progress"
    job.save()

    input_path = job.input_file.path
    output_format = job.conversion_format.lower()
    output_path = f"{os.path.splitext(input_path)[0]}.{output_format}"

    try:
        if output_format in ["jpg", "png", "gif"]:
            with Image.open(input_path) as img:
                img.convert("RGB").save(output_path, output_format.upper())

        elif output_format in ["mp4", "avi", "gif"]:
            clip = VideoFileClip(input_path)
            clip.write_videofile(output_path, codec="libx264")

        # Simulate long task with progress updates
        for i in range(1, 11):  # 10 steps, each 10% progress
            time.sleep(1)  # Simulate processing delay
            progress = i * 10
            self.update_state(state="PROGRESS", meta={"progress": progress})

        job.status = "completed"
        job.progress = 100
        job.output_file.name = output_path.replace(os.getcwd() + "/", "")
        job.result = "Conversion successful!"

    except Exception as e:
        job.status = "failed"
        job.result = str(e)

    job.save()
    return {"status": "completed", "progress": 100}
