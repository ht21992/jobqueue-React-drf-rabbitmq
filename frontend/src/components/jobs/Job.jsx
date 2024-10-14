import React from "react";

const Job = ({ job }) => {
  return (
    <div className="col col-12 p-2 todo-item" job-id={job.id}>
      <div className="input-group">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <input
              type="checkbox"
              aria-label="Checkbox for following text input"
            />
          </div>
        </div>
        <input
          type="text"
          className="form-control"
          value={job.title}
          readOnly
        />
        <div className="input-group-append">
          <button
            job-id={job.id}
            className="btn btn-outline-secondary bg-danger text-white"
            type="button"
            id="button-addon2 "
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default Job;
