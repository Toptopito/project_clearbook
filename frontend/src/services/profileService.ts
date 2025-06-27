import axios from 'axios';

// Using hardcoded API URL until config module is properly imported
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define types for profile data
export interface UserProfile {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  onboardingCompleted: boolean;
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
export const profileService = {
  // Get current user profile
  getCurrentProfile: async (): Promise<UserProfile> => {
    try {
      const response = await axios.get(
        `${API_URL}/profile`,
        getAuthConfig()
      );
      return response.data.data.profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await axios.put(
        `${API_URL}/profile`,
        profileData,
        getAuthConfig()
      );
      return response.data.data.profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Complete onboarding
  completeOnboarding: async (): Promise<{ onboardingCompleted: boolean }> => {
    try {
      const response = await axios.put(
        `${API_URL}/profile/onboarding`,
        {},
        getAuthConfig()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }
};

export default profileService;
