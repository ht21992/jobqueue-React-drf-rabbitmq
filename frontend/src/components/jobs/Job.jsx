import React, { useEffect, useState } from "react";
import axios from "axios";

const Job = ({ job }) => {
  const [progress, setProgress] = useState(job.progress);
  const [status, setStatus] = useState(job.status);
  const [outputFile, setOutputFile] = useState(job.output_file);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`/api/jobs/${job.id}/progress/`)
        .then((response) => {
          const { progress, status, output_file } = response.data;

          setProgress(progress);
          setStatus(status);
          setOutputFile(output_file);

          // Stop polling if job is completed
          if (status === "completed") {
            clearInterval(interval);
          }
        })
        .catch((error) => console.error("Error fetching job progress:", error));
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [job.id]);

  return (
    <tr>
      <td>{job.id}</td>
      <td>
        <span className={`badge ${status === "completed" ? "bg-success" : "bg-warning text-dark"}`}>
          {status}
        </span>
      </td>
      <td>
        <div className="progress">
          <div
            className={`progress-bar ${progress === 100 ? "bg-success" : "bg-info"}`}
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>
      </td>
      <td>
        {outputFile && (
          <a href={outputFile} className="btn btn-sm btn-outline-success" download>
            Download
          </a>
        )}
      </td>
    </tr>
  );
};

export default Job;
