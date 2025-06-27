import { Request, Response } from 'express';
import { User } from '../models';

/**
 * Get current user profile
 * @route GET /api/profile
 */
export const getCurrentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is attached to request by auth middleware
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    // Return only necessary profile information
    res.status(200).json({
      success: true,
      data: {
        profile: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          dateOfBirth: user.date_of_birth,
          gender: user.gender,
          phone: user.phone,
          onboardingCompleted: user.onboarding_completed
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving profile'
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is attached to request by auth middleware
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const { firstName, lastName, dateOfBirth, gender, phone } = req.body;

    // Find user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Update user profile fields
    await user.update({
      first_name: firstName !== undefined ? firstName : user.first_name,
      last_name: lastName !== undefined ? lastName : user.last_name,
      date_of_birth: dateOfBirth !== undefined ? dateOfBirth : user.date_of_birth,
      gender: gender !== undefined ? gender : user.gender,
      phone: phone !== undefined ? phone : user.phone,
      updated_at: new Date()
    });

    // Return updated profile
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          dateOfBirth: user.date_of_birth,
          gender: user.gender,
          phone: user.phone,
          onboardingCompleted: user.onboarding_completed
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

/**
 * Complete onboarding
 * @route PUT /api/profile/onboarding
 */
export const completeOnboarding = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is attached to request by auth middleware
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    // Find user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Update onboarding status
    await user.update({
      onboarding_completed: true,
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully',
      data: { onboardingCompleted: true }
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing onboarding'
    });
  }
};

export default {
  getCurrentProfile,
  updateProfile,
  completeOnboarding
};
