import React, { useState } from "react";
import Job from "./Job";
import { addJobAsync } from "../../slices/jobSlice";
import { useDispatch } from "react-redux";

const JobsList = ({ jobs }) => {
  const dispatch = useDispatch();
  const [inputFile, setInputFile] = useState(null);
  const [conversionFormat, setConversionFormat] = useState("png");

  const handleAddJob = () => {
    if (inputFile) {
      dispatch(addJobAsync(inputFile, conversionFormat))
        .then(() => {
          setInputFile(null);
          setConversionFormat("png");
        })
        .catch((error) => console.error("Failed to add job:", error));
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mb-4">
        <h3 className="text-center mb-3">File Format Conversion</h3>
        <div className="d-flex justify-content-around align-items-center">
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

          <select
            className="form-select w-auto mx-2"
            value={conversionFormat}
            onChange={(e) => setConversionFormat(e.target.value)}
          >
            <option value="png">PNG</option>
            <option value="mp4">MP4</option>
            <option value="avi">AVI</option>
          </select>

          <button
            type="button"
            className="btn btn-primary shadow-sm"
            onClick={handleAddJob}
          >
            Convert
          </button>
        </div>
      </div>

      <table className="table shadow-sm">
        <thead className="table-dark">
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
