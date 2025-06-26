import axios from 'axios';
// Using hardcoded API URL until config module is properly imported
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define types for lab result data
export interface LabResult {
  id?: number;
  user_id?: number;
  test_name: string;
  test_date: string;
  category?: string;
  result_value: string;
  unit?: string;
  reference_range?: string;
  is_abnormal: boolean;
  notes?: string;
  lab_name?: string;
  doctor_name?: string;
  created_at?: string;
  updated_at?: string;
}

// Configure axios with auth token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// API service functions
export const labResultService = {
  // Get all lab results for the current user
  getAllLabResults: async (): Promise<LabResult[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/lab-results`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching lab results:', error);
      throw error;
    }
  },

  // Get a specific lab result by ID
  getLabResult: async (id: number): Promise<LabResult> => {
    try {
      const response = await axios.get(
        `${API_URL}/lab-results/${id}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching lab result ${id}:`, error);
      throw error;
    }
  },

  // Create a new lab result
  createLabResult: async (labResult: LabResult): Promise<LabResult> => {
    try {
      const response = await axios.post(
        `${API_URL}/lab-results`,
        labResult,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating lab result:', error);
      throw error;
    }
  },

  // Update an existing lab result
  updateLabResult: async (id: number, labResult: LabResult): Promise<LabResult> => {
    try {
      const response = await axios.put(
        `${API_URL}/lab-results/${id}`,
        labResult,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating lab result ${id}:`, error);
      throw error;
    }
  },

  // Delete a lab result
  deleteLabResult: async (id: number): Promise<void> => {
    try {
      await axios.delete(
        `${API_URL}/lab-results/${id}`,
        getAuthConfig()
      );
    } catch (error) {
      console.error(`Error deleting lab result ${id}:`, error);
      throw error;
    }
  },

  // Upload a document for a lab result
  uploadDocument: async (labResultId: number, file: File): Promise<{ document_url: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API_URL}/lab-results/${labResultId}/document`,
        formData,
        {
          ...getAuthConfig(),
          headers: {
            ...getAuthConfig().headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error uploading document for lab result ${labResultId}:`, error);
      throw error;
    }
  }
};

export default labResultService;
