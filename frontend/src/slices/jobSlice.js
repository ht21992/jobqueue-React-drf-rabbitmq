// slices/jobSlice.js

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  jobs: [],
};

export const addJobAsync = (inputFile, conversionFormat) => async (dispatch) => {
  const formData = new FormData();
  formData.append("input_file", inputFile);
  formData.append("conversion_format", conversionFormat);

  try {
    const res = await axios.post("api/jobs/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 201) {
      dispatch(addJob(res.data));
      return Promise.resolve();
    }
  } catch (error) {
    console.error("Failed to add job:", error);
    return Promise.reject(error);
  }
};

export const fetchJobsListAsync = createAsyncThunk(
  "jobs/fetchJobsListAsync",
  async () => {
    const response = await axios.get("api/jobs/");
    return response.data;
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    addJob: (state, action) => {
      state.jobs.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobsListAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobsListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobsListAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addJob } = jobSlice.actions;

export default jobSlice.reducer;
