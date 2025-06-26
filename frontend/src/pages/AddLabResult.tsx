import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { labResultService, LabResult as LabResultType } from '../services/labResultService';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../config';
import '../styles/AddLabResult.css';

interface FormData {
  testName: string;
  testDate: string;
  category: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  notes: string;
  labName: string;
  doctorName: string;
}

const initialFormData: FormData = {
  testName: '',
  testDate: '',
  category: '',
  resultValue: '',
  unit: '',
  referenceRange: '',
  isAbnormal: false,
  notes: '',
  labName: '',
  doctorName: '',
};

export const AddLabResult: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [hasDocument, setHasDocument] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isAbnormal' ? (e.target as HTMLInputElement).checked : value,
    });
    
    // Clear error for field when it's changed
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'hasDocument') {
      setHasDocument(checked);
      if (!checked) setFile(null);
    } else {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Validate required fields
    if (!formData.testName.trim()) {
      newErrors.testName = 'Test name is required';
    } else if (formData.testName.length > 100) {
      newErrors.testName = 'Test name must be 100 characters or less';
    }

    if (!formData.testDate) {
      newErrors.testDate = 'Test date is required';
    } else {
      // Check if date is in the future
      if (formData.testDate > todayStr) {
        newErrors.testDate = 'Test date cannot be in the future';
      }

      // Check if date is too far in the past (more than 100 years ago)
      const testDate = new Date(formData.testDate);
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(now.getFullYear() - 100);

      if (testDate < hundredYearsAgo) {
        newErrors.testDate = 'Test date is too far in the past';
      }
    }

    if (!formData.resultValue.trim()) {
      newErrors.resultValue = 'Result value is required';
    } else if (isNaN(Number(formData.resultValue)) && !formData.resultValue.includes('<') && !formData.resultValue.includes('>')) {
      // Allow values like "<5" or ">100" but otherwise must be numeric
      newErrors.resultValue = 'Result value must be a number or include < or >';
    }

    if (formData.unit && formData.unit.length > 20) {
      newErrors.unit = 'Unit must be 20 characters or less';
    }

    if (formData.referenceRange && formData.referenceRange.length > 50) {
      newErrors.referenceRange = 'Reference range must be 50 characters or less';
    }

    if (formData.labName && formData.labName.length > 100) {
      newErrors.labName = 'Lab name must be 100 characters or less';
    }

    if (formData.doctorName && formData.doctorName.length > 100) {
      newErrors.doctorName = 'Doctor name must be 100 characters or less';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Map form data to API model
        const labResultData: LabResultType = {
          test_name: formData.testName,
          test_date: formData.testDate,
          category: formData.category || undefined,
          result_value: formData.resultValue,
          unit: formData.unit || undefined,
          reference_range: formData.referenceRange || undefined,
          is_abnormal: formData.isAbnormal,
          notes: formData.notes || undefined,
          lab_name: formData.labName || undefined,
          doctor_name: formData.doctorName || undefined
        };
        
        // Submit lab result to API
        const createdResult = await labResultService.createLabResult(labResultData);
        
        // If there's a file to upload, do that after creating the result
        if (hasDocument && file) {
          try {
            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
              setSubmitError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
              return;
            }
            
            // Validate file type
            const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
            if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
              setSubmitError(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
              return;
            }
            
            await labResultService.uploadDocument(createdResult.id!, file);
          } catch (uploadError) {
            console.error('Document upload error:', uploadError);
            // We'll still consider the submission successful even if document upload fails
            // Just show a warning
            alert('Lab result saved but document upload failed. You can try uploading the document later.');
            navigate('/lab-results');
            return;
          }
        }
        
        // All good! Navigate back to results list
        alert('Lab result added successfully!');
        navigate('/lab-results');
      } catch (error: any) {
        console.error('Error submitting lab result:', error);
        setSubmitError(error.response?.data?.message || 'Failed to save lab result. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/lab-results');
  };

  return (
    <Layout>
      <div className="add-lab-result-container">
        <div className="add-lab-result-header">
          <h1>Add New Lab Result</h1>
          <p>Enter the details of your lab test result and optionally upload the original document.</p>
        </div>
        
        <form className="add-lab-result-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Test Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="testName">Test Name*</label>
                <input
                  type="text"
                  id="testName"
                  name="testName"
                  value={formData.testName}
                  onChange={handleInputChange}
                  className={errors.testName ? 'error' : ''}
                  placeholder="e.g., Complete Blood Count"
                />
                {errors.testName && <div className="error-message">{errors.testName}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="testDate">Test Date*</label>
                <input
                  type="date"
                  id="testDate"
                  name="testDate"
                  value={formData.testDate}
                  onChange={handleInputChange}
                  className={errors.testDate ? 'error' : ''}
                />
                {errors.testDate && <div className="error-message">{errors.testDate}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Blood">Blood</option>
                  <option value="Urine">Urine</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="labName">Laboratory Name</label>
                <input
                  type="text"
                  id="labName"
                  name="labName"
                  value={formData.labName}
                  onChange={handleInputChange}
                  placeholder="e.g., City Medical Lab"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="doctorName">Ordering Doctor</label>
                <input
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  placeholder="e.g., Dr. Jane Smith"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Result Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="resultValue">Result Value*</label>
                <input
                  type="text"
                  id="resultValue"
                  name="resultValue"
                  value={formData.resultValue}
                  onChange={handleInputChange}
                  className={errors.resultValue ? 'error' : ''}
                  placeholder="e.g., 120"
                />
                {errors.resultValue && <div className="error-message">{errors.resultValue}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="e.g., mg/dL"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="referenceRange">Reference Range</label>
                <input
                  type="text"
                  id="referenceRange"
                  name="referenceRange"
                  value={formData.referenceRange}
                  onChange={handleInputChange}
                  placeholder="e.g., 70-130 mg/dL"
                />
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isAbnormal"
                  name="isAbnormal"
                  checked={formData.isAbnormal}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="isAbnormal">Mark as Abnormal Result</label>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional information about this test result"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Original Document</h2>
            <div className="form-row">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="hasDocument"
                  name="hasDocument"
                  checked={hasDocument}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="hasDocument">Attach Original Document</label>
              </div>
            </div>
            
            {hasDocument && (
              <div className="form-row document-upload">
                <div className="form-group full-width">
                  <label htmlFor="documentFile">Upload Document (PDF, JPG, PNG)</label>
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="documentFile"
                      name="documentFile"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <div className="file-upload-button">
                      <Button type="button">Browse Files</Button>
                    </div>
                  </div>
                  {file && (
                    <div className="file-selected">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {submitError && (
            <div className="p-4 mt-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md">
              <p>{submitError}</p>
            </div>
          )}

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Lab Result'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddLabResult;
