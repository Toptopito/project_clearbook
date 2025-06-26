import { Request, Response } from 'express';
import { LabResult, User } from '../models';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new lab result
 * @route POST /api/lab-results
 */
export const createLabResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      test_name, 
      test_date, 
      result_value, 
      unit, 
      reference_range_low, 
      reference_range_high, 
      lab_name, 
      ordering_doctor, 
      notes,
      is_abnormal
    } = req.body;

    // Get user_id from authenticated user
    const userId = req.user?.userId;

    // Validate required fields
    if (!test_name || !test_date || result_value === undefined || !unit) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
      return;
    }

    // Validate user exists
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Create the lab result
    const labResult = await LabResult.create({
      id: uuidv4(),
      user_id: userId,
      test_name,
      test_date: new Date(test_date),
      result_value: parseFloat(result_value),
      unit,
      reference_range_low: reference_range_low ? parseFloat(reference_range_low) : null,
      reference_range_high: reference_range_high ? parseFloat(reference_range_high) : null,
      lab_name: lab_name || null,
      ordering_doctor: ordering_doctor || null,
      notes: notes || null,
      is_abnormal: is_abnormal || false,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Lab result created successfully',
      data: {
        labResult
      }
    });
  } catch (error) {
    console.error('Error creating lab result:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during lab result creation'
    });
  }
};

/**
 * Get all lab results for the authenticated user
 * @route GET /api/lab-results
 */
export const getLabResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    const labResults = await LabResult.findAll({
      where: { user_id: userId },
      order: [['test_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        labResults
      }
    });
  } catch (error) {
    console.error('Error fetching lab results:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lab results'
    });
  }
};

/**
 * Get a specific lab result by ID
 * @route GET /api/lab-results/:id
 */
export const getLabResultById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const labResult = await LabResult.findOne({
      where: { 
        id,
        user_id: userId // Ensure user can only access their own lab results
      }
    });

    if (!labResult) {
      res.status(404).json({
        success: false,
        message: 'Lab result not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        labResult
      }
    });
  } catch (error) {
    console.error('Error fetching lab result:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lab result'
    });
  }
};

/**
 * Update a lab result
 * @route PUT /api/lab-results/:id
 */
export const updateLabResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { 
      test_name, 
      test_date, 
      result_value, 
      unit, 
      reference_range_low, 
      reference_range_high, 
      lab_name, 
      ordering_doctor, 
      notes,
      is_abnormal
    } = req.body;

    // Find the lab result and ensure it belongs to the user
    const labResult = await LabResult.findOne({
      where: { 
        id,
        user_id: userId
      }
    });

    if (!labResult) {
      res.status(404).json({
        success: false,
        message: 'Lab result not found or unauthorized'
      });
      return;
    }

    // Update the lab result
    await labResult.update({
      ...(test_name && { test_name }),
      ...(test_date && { test_date: new Date(test_date) }),
      ...(result_value !== undefined && { result_value: parseFloat(result_value) }),
      ...(unit && { unit }),
      ...({ reference_range_low: reference_range_low ? parseFloat(reference_range_low) : null }),
      ...({ reference_range_high: reference_range_high ? parseFloat(reference_range_high) : null }),
      ...({ lab_name: lab_name || null }),
      ...({ ordering_doctor: ordering_doctor || null }),
      ...({ notes: notes || null }),
      ...(is_abnormal !== undefined && { is_abnormal }),
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Lab result updated successfully',
      data: {
        labResult
      }
    });
  } catch (error) {
    console.error('Error updating lab result:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during lab result update'
    });
  }
};

/**
 * Delete a lab result
 * @route DELETE /api/lab-results/:id
 */
export const deleteLabResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Find the lab result and ensure it belongs to the user
    const labResult = await LabResult.findOne({
      where: { 
        id,
        user_id: userId
      }
    });

    if (!labResult) {
      res.status(404).json({
        success: false,
        message: 'Lab result not found or unauthorized'
      });
      return;
    }

    // Delete the lab result
    await labResult.destroy();

    res.status(200).json({
      success: true,
      message: 'Lab result deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lab result:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during lab result deletion'
    });
  }
};
