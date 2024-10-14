// slices/jobSlice.js

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  jobs: [],
};


export const addJobAsync = (title) => async(dispatch) => {
    const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
    };

    try{
        const body = JSON.stringify({title});
        const res = await axios.post('api/jobs/', body, config)

        if (res.status === 201){
            dispatch(addJob(res.data))
            return Promise.resolve(); // Success
        }
    }

    catch(error){
        return Promise.reject(error); // Failure
    }



}



// extra reducers

export const fetchJobsListAsync = createAsyncThunk(
  "jobs/fetchJobsListAsync",
  async () => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get("api/jobs/", config);
    return response.data;
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: initialState,
  reducers: {
    addJob: (state, action) => {
      state.jobs.push(action.payload);
    },

    updateJobProgress: (state, action) => {
      const { id, progress, status } = action.payload;
      const job = state.jobs.find((job) => job.id === id);
      if (job) {
        job.progress = progress;
        job.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchJobsListAsync.pending, (state, action) => {
      state.loading = true;
    //   state.jobs = [];
    });
    builder.addCase(fetchJobsListAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    });
    builder.addCase(fetchJobsListAsync.rejected, (state, action) => {
      state.loading = false;
    //   state.jobs = [];
    });
  },
});

export const { addJob, updateJobProgress } = jobSlice.actions;

export default jobSlice.reducer;
