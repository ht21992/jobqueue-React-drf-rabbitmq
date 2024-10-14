import { configureStore } from '@reduxjs/toolkit';
import jobSlice from '../slices/jobSlice';

export const store = configureStore({
    reducer: {
        job: jobSlice,
    },
});
