import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Types
interface LabResult {
  id: string;
  user_id: string;
  document_id: string | null;
  test_name: string;
  test_date: string;
  result_value: number;
  unit: string;
  reference_range_low: number | null;
  reference_range_high: number | null;
  lab_name: string | null;
  ordering_doctor: string | null;
  notes: string | null;
  is_abnormal: boolean;
  created_at: string;
  updated_at: string;
}

interface LabResultsState {
  results: LabResult[];
  currentResult: LabResult | null;
  isLoading: boolean;
  error: string | null;
}

// Setup axios interceptor for auth token
const setupAuthInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

setupAuthInterceptor();

// Initial state
const initialState: LabResultsState = {
  results: [],
  currentResult: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchLabResults = createAsyncThunk(
  'labResults/fetchLabResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/lab-results`);
      return response.data.data.labResults;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch lab results'
      );
    }
  }
);

export const fetchLabResultById = createAsyncThunk(
  'labResults/fetchLabResultById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/lab-results/${id}`);
      return response.data.data.labResult;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch lab result'
      );
    }
  }
);

export const createLabResult = createAsyncThunk(
  'labResults/createLabResult',
  async (labResultData: Partial<LabResult>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/lab-results`, labResultData);
      return response.data.data.labResult;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create lab result'
      );
    }
  }
);

export const updateLabResult = createAsyncThunk(
  'labResults/updateLabResult',
  async ({ id, data }: { id: string; data: Partial<LabResult> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/lab-results/${id}`, data);
      return response.data.data.labResult;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update lab result'
      );
    }
  }
);

export const deleteLabResult = createAsyncThunk(
  'labResults/deleteLabResult',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/lab-results/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete lab result'
      );
    }
  }
);

const labResultsSlice = createSlice({
  name: 'labResults',
  initialState,
  reducers: {
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all lab results
    builder
      .addCase(fetchLabResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLabResults.fulfilled, (state, action: PayloadAction<LabResult[]>) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(fetchLabResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch lab result by ID
    builder
      .addCase(fetchLabResultById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLabResultById.fulfilled, (state, action: PayloadAction<LabResult>) => {
        state.isLoading = false;
        state.currentResult = action.payload;
      })
      .addCase(fetchLabResultById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create lab result
    builder
      .addCase(createLabResult.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLabResult.fulfilled, (state, action: PayloadAction<LabResult>) => {
        state.isLoading = false;
        state.results = [...state.results, action.payload];
      })
      .addCase(createLabResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update lab result
    builder
      .addCase(updateLabResult.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLabResult.fulfilled, (state, action: PayloadAction<LabResult>) => {
        state.isLoading = false;
        state.results = state.results.map((result) =>
          result.id === action.payload.id ? action.payload : result
        );
        state.currentResult = action.payload;
      })
      .addCase(updateLabResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete lab result
    builder
      .addCase(deleteLabResult.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLabResult.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.results = state.results.filter((result) => result.id !== action.payload);
        if (state.currentResult && state.currentResult.id === action.payload) {
          state.currentResult = null;
        }
      })
      .addCase(deleteLabResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentResult, clearError } = labResultsSlice.actions;
export default labResultsSlice.reducer;
