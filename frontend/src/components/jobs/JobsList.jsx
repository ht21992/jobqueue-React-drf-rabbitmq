import React, { useState } from "react";
import Job from "./Job";
import { addJobAsync } from "../../slices/jobSlice";
import { useDispatch } from "react-redux";

const JobsList = ({ jobs }) => {
  const dispatch = useDispatch();
  const [inputFile, setInputFile] = useState(null);
  const [conversionFormat, setConversionFormat] = useState("jpg"); // Default format

  const handleAddJob = () => {
    if (inputFile) {
      dispatch(addJobAsync(inputFile, conversionFormat))
        .then(() => {
          setInputFile(null); // Reset the input file
          setConversionFormat("jpg"); // Reset to default format
        })
        .catch((error) => console.error("Failed to add job:", error));
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center mb-3">
        <div className="col-auto">
          <div className="custom-file mb-2">
            <input
              type="file"
              className="custom-file-input"
              id="inputFile"
              onChange={(e) => setInputFile(e.target.files[0])}
              required
            />
            <label className="custom-file-label" htmlFor="inputFile">
              {inputFile ? inputFile.name : "Choose file"}
            </label>
          </div>
        </div>
        <div className="col-auto">
          <select
            className="form-select"
            value={conversionFormat}
            onChange={(e) => setConversionFormat(e.target.value)}
            style={{ width: "150px" }} // Set a fixed width for uniformity
          >
            {/* <option value="jpg">JPG</option> */}
            <option value="png">PNG</option>
            <option value="mp4">MP4</option>
            <option value="avi">AVI</option>
          </select>
        </div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddJob}
          >
            Convert
          </button>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Job ID</th>
            <th scope="col">Status</th>
            <th scope="col">Progress</th>
            <th scope="col">Output File</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <Job key={job.id} job={job} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsList;
