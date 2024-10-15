import React, { useEffect, useState } from "react";
import axios from "axios";

const Job = ({ job }) => {
  const progressDict = {
    STARTED: 0,
    PENDING: 0,
    SUCCESS: 100,
    FAILURE: 0,
    RETRY: 0,
    REVOKED: 0,
  };

  const statusClassDict = {
    STARTED: "bg-dark text-white",
    PENDING: "bg-warning text-dark",
    SUCCESS: "bg-success text-white",
    PROGRESS: "bg-info text-white",
    FAILURE: "bg-danger text-dark",
    RETRY: "bg-dark text-white",
    REVOKED: "bg-dark text-white",
  };

  const [progress, setProgress] = useState(progressDict[job.status]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(job.status);
  const [outputFile, setOutputFile] = useState(job.output_file);

  if (!["SUCCESS", "FAILURE"].includes(job.status)) {
    useEffect(() => {
      const interval = setInterval(() => {
        axios
          .get(`/api/celery-progress/${job.task_id}/`)
          .then((response) => {
            setProgress(response.data.progress.current);
            setStatus(response.data.state);
            setDescription(response.data.progress.description);
            // // Stop polling if job is completed
            if (response.data.complete && response.data.success) {
              setOutputFile(response.data.result.output_file);
              setProgress(response.data.progress.current);
              setStatus(response.data.result.status);
              setDescription("");
              clearInterval(interval);

            }
          })
          .catch((error) =>
            console.error("Error fetching job progress:", error)
          );
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    }, [job.id]);
  }

  return (
    <tr>
      <td>{job.id}</td>
      <td>
        <span className={`badge ${statusClassDict[status]}`}>{status}</span>
      </td>
      <td>

      <div className="progress">
          <div
            className={`progress-bar ${
              progress === 100 ? "bg-success" : "bg-info"
            }`}
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>

       </div>
       <small>{description}</small>
      </td>
      <td>
        {outputFile && (
          <a
            href={outputFile}
            className="btn btn-sm btn-outline-success"
            download
          >
            Download
          </a>
        )}
      </td>
    </tr>
  );
};

export default Job;
