import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService, { UserProfile } from '../services/profileService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: ''
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await profileService.getCurrentProfile();
        setProfile(profileData);
        setFormData({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dateOfBirth: profileData.dateOfBirth || '',
          gender: profileData.gender || '',
          phone: profileData.phone || ''
        });
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedProfile = await profileService.updateProfile(formData);
      setProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle completing onboarding if not already done
  const handleCompleteOnboarding = async () => {
    if (profile && !profile.onboardingCompleted) {
      try {
        setLoading(true);
        await profileService.completeOnboarding();
        setProfile(prev => prev ? { ...prev, onboardingCompleted: true } : null);
      } catch (err) {
        console.error('Failed to complete onboarding:', err);
        setError('Failed to complete onboarding. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <Card className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold font-poppins" style={{ color: 'var(--primary-dark)' }}>Profile Settings</h1>
            {!isEditing && (
              <Button 
                variant="primary" 
                onClick={() => setIsEditing(true)}
                className="flex items-center w-full sm:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </Button>
            )}
          </div>

          {loading && !profile ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error && !profile ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              {error}
              <Button onClick={() => window.location.reload()} className="ml-4">
                Retry
              </Button>
            </div>
          ) : (
            <div>
              {saveSuccess && (
                <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium font-inter mb-1" style={{ color: 'var(--text)' }}>Last Name</label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium font-inter mb-1" style={{ color: 'var(--text)' }}>Date of Birth</label>
                    <Input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium font-inter mb-1" style={{ color: 'var(--text)' }}>Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
                      style={{ 
                        borderColor: 'var(--border)',
                        backgroundColor: 'white',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-inter)'
                      }}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium font-inter mb-1" style={{ color: 'var(--text)' }}>Phone Number</label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium font-inter mb-1" style={{ color: 'var(--text)' }}>Email</label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={profile?.email || ''}
                      disabled
                    />
                  </div>

                  <div className="pt-4 mt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium font-inter" style={{ color: 'var(--text)' }}>Onboarding Status</h3>
                        <p className="text-xs font-inter mt-1" style={{ color: 'var(--text-muted)' }}>Complete the setup process to unlock all features</p>
                      </div>
                      {profile?.onboardingCompleted ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Completed
                        </span>
                      ) : (
                        <>
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            Pending
                          </span>
                          <Button 
                            type="button" 
                            variant="secondary"
                            className="ml-4 text-xs md:text-sm"
                            onClick={handleCompleteOnboarding}
                            disabled={loading}
                          >
                            Complete Now
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="flex items-center justify-center w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          firstName: profile?.firstName || '',
                          lastName: profile?.lastName || '',
                          dateOfBirth: profile?.dateOfBirth || '',
                          gender: profile?.gender || '',
                          phone: profile?.phone || ''
                        });
                      }}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>

              {!isEditing && (
                <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                  <h2 className="text-xl font-semibold font-poppins mb-4" style={{ color: 'var(--primary-dark)' }}>Account Security</h2>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button 
                      variant="secondary"
                      onClick={() => navigate('/change-password')}
                      className="flex items-center justify-center w-full sm:w-auto text-xs md:text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Change Password
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex items-center justify-center w-full sm:w-auto text-xs md:text-sm text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete Account
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Profile;
