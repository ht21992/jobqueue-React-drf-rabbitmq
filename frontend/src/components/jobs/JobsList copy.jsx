import React, { useState, useEffect } from "react";
import Job from "./Job";
import { addJobAsync } from "../../slices/jobSlice";
import { useDispatch, useSelector } from "react-redux";
const JobsList = ({ jobs }) => {

  const dispatch = useDispatch();
  const [jobTitle, setJobTitle] = useState("");

  const handleAddJob = () => {
    dispatch(addJobAsync(jobTitle))
    .then(() => setJobTitle("")) // Reset only on success
    .catch((error) => console.error("Failed to add job:", error));
  };
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center main-row">
        <div className="col shadow main-col bg-white">
          <div className="row justify-content-between text-white p-2">
            <div className="form-group flex-fill mb-2">
              <input
                id="job-input"
                type="text"
                value={jobTitle}
                className="form-control"
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter job title"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary mb-2 ml-2"
              onClick={handleAddJob}
            >
              Add job
            </button>
          </div>
          <div className="row" id="job-container">
            {jobs.map((job, index) => (
              <Job key={index} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsList;
