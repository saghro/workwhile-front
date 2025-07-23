// Enhanced Job Application Component with Better Error Handling
// src/components/JobApplicationPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';

const JobApplicationPage = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Professional Information
    coverLetter: '',
    expectedSalary: '',
    availableFrom: '',
    currentPosition: '',
    totalExperience: '',

    // Education
    education: '',
    university: '',
    graduationYear: '',

    // Skills and Files
    skills: '',
    resume: null,
    portfolio: null,

    // Additional
    linkedin: '',
    website: '',
    references: '',
    motivation: '',
    relocate: false,
    remoteWork: false
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    resume: null,
    portfolio: null
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchJobAndCheckApplication = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Fetching job data for application page...');

        // Fetch job details
        const jobData = await jobService.getJobById(id);
        console.log('✅ Fetched job for application:', jobData?.title);
        setJob(jobData);

        // Pre-fill user data if available
        if (user) {
          console.log('👤 Pre-filling form with user data');
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.profile?.phone || '',
            currentPosition: user.profile?.experience || '',
            skills: user.profile?.skills?.join(', ') || '',
            education: user.profile?.education || ''
          }));
        }

        // Check if user has already applied
        if (isAuthenticated && user && user.role === 'candidate') {
          console.log('🔍 Checking if user already applied...');
          const hasApplied = await applicationService.hasAppliedToJob(id);

          if (hasApplied) {
            console.log('⚠️ User has already applied to this job');
            navigate(`/jobs/${id}`, {
              state: { message: 'You have already applied to this job.' }
            });
            return;
          }
        }
      } catch (err) {
        console.error('❌ Error fetching job or checking application:', err);
        setError(err.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndCheckApplication();
  }, [id, isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      console.log(`📁 File selected for ${name}:`, file.name, file.size, 'bytes');

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError(`${name} file size must be less than 5MB`);
        return;
      }

      // Validate file type
      const allowedTypes = {
        resume: ['.pdf', '.doc', '.docx'],
        portfolio: ['.pdf', '.doc', '.docx', '.zip', '.rar']
      };

      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes[name].includes(fileExtension)) {
        setError(`${name} must be one of: ${allowedTypes[name].join(', ')}`);
        return;
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));

      setUploadedFiles(prev => ({
        ...prev,
        [name]: file.name
      }));

      // Clear any previous errors
      setError(null);
      console.log(`✅ File validated and added: ${file.name}`);
    }
  };

  const removeFile = (fieldName) => {
    console.log(`🗑️ Removing file: ${fieldName}`);
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));

    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  const validateForm = () => {
    console.log('🔍 Validating form...');
    const requiredFields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      resume: 'Resume'
    };

    const missingFields = [];
    const errors = [];

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field]) {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate cover letter minimum length
    if (formData.coverLetter && formData.coverLetter.length < 50) {
      errors.push('Cover letter should be at least 50 characters long');
    }

    // Validate file
    if (formData.resume && !(formData.resume instanceof File)) {
      errors.push('Resume must be a valid file');
    }

    setValidationErrors(errors);

    if (errors.length > 0) {
      console.error('❌ Form validation failed:', errors);
      setError(`Validation failed: ${errors.join(', ')}`);
      return false;
    }

    console.log('✅ Form validation passed');
    return true;
  };

  const prepareApplicationData = () => {
    console.log('📦 Preparing application data...');

    // Create FormData for file upload
    const applicationData = new FormData();

    // Basic application data
    applicationData.append('jobId', id);

    if (formData.coverLetter?.trim()) {
      applicationData.append('coverLetter', formData.coverLetter.trim());
    }

    // Optional fields
    if (formData.expectedSalary && !isNaN(formData.expectedSalary) && formData.expectedSalary > 0) {
      applicationData.append('expectedSalary', Number(formData.expectedSalary));
    }
    if (formData.availableFrom) {
      applicationData.append('availableFrom', formData.availableFrom);
    }

    // Personal information as JSON string
    const personalInfo = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      currentPosition: formData.currentPosition.trim(),
      totalExperience: formData.totalExperience,
      education: formData.education,
      university: formData.university.trim(),
      graduationYear: formData.graduationYear,
      skills: formData.skills.trim(),
      linkedin: formData.linkedin.trim(),
      website: formData.website.trim(),
      references: formData.references.trim(),
      motivation: formData.motivation.trim(),
      relocate: formData.relocate,
      remoteWork: formData.remoteWork
    };

    applicationData.append('personalInfo', JSON.stringify(personalInfo));

    // Files
    if (formData.resume) {
      applicationData.append('resume', formData.resume);
      console.log('📄 Resume attached:', formData.resume.name);
    }
    if (formData.portfolio) {
      applicationData.append('portfolio', formData.portfolio);
      console.log('📁 Portfolio attached:', formData.portfolio.name);
    }

    if (debugMode) {
      applicationService.debugFormData(applicationData);
    }

    return applicationData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Starting application submission...');

    if (!isAuthenticated || !user) {
      console.log('⚠️ User not authenticated, redirecting to login');
      navigate('/login', { state: { from: `/jobs/${id}/apply` } });
      return;
    }

    if (user.role !== 'candidate') {
      setError('Only candidates can apply for jobs');
      return;
    }

    if (!validateForm()) {
      console.log('❌ Form validation failed, stopping submission');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setValidationErrors([]);

      console.log('📦 Preparing application data...');
      const applicationData = prepareApplicationData();

      // Client-side validation using the service
      console.log('🔍 Running service validation...');
      const validation = applicationService.validateApplicationData(applicationData);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setError(`Validation failed: ${validation.errors.join(', ')}`);
        return;
      }

      console.log('📡 Submitting application...');
      const response = await applicationService.createApplication(applicationData);

      console.log('✅ Application submitted successfully!', response);

      navigate('/jobs', {
        state: {
          message: 'Application submitted successfully! You will be notified if the employer is interested.',
          type: 'success'
        }
      });

    } catch (err) {
      console.error('❌ Application submission failed:', err);
      setError(err.message || 'Failed to submit application');

      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    console.log('🐛 Debug mode:', !debugMode ? 'enabled' : 'disabled');
  };

  if (loading) {
    return (
        <div className="max-w-4xl mx-auto px-4 mt-24 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
    );
  }

  if (error && !job) {
    return (
        <div className="max-w-4xl mx-auto px-4 mt-24 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
                onClick={() => navigate(`/jobs/${id}`)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Back to Job Details
            </button>
          </div>
        </div>
    );
  }

  if (!job) {
    return (
        <div className="max-w-4xl mx-auto px-4 mt-24 text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-medium text-gray-600">Job not found</h2>
          <p className="mt-4 text-gray-500">The job listing you're looking for doesn't exist or has been removed</p>
          <button
              onClick={() => navigate('/jobs')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Back to Job Listings
          </button>
        </div>
    );
  }

  let process;
  return (
      <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
        {/* Debug toggle for development */}
        {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <button
                  onClick={toggleDebugMode}
                  className="text-sm text-yellow-800 hover:text-yellow-900"
              >
                🐛 Debug Mode: {debugMode ? 'ON' : 'OFF'}
              </button>
            </div>
        )}

        <div className="mb-6">
          <button
              onClick={() => navigate(`/jobs/${id}`)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Job Details
          </button>
        </div>

        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b">
            <h1 className="text-3xl font-bold text-gray-900">Apply for {job.title}</h1>
            <p className="mt-2 text-gray-600">{job.company?.name || 'Company'}</p>

            {/* Job Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600">{job.location}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-600">{job.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="ml-2 text-gray-600">{job.experienceLevel}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+212 6XX XXX XXX"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="currentPosition" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Position
                    </label>
                    <input
                        type="text"
                        id="currentPosition"
                        name="currentPosition"
                        value={formData.currentPosition}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Software Developer"
                    />
                  </div>

                  <div>
                    <label htmlFor="totalExperience" className="block text-sm font-medium text-gray-700 mb-2">
                      Total Experience
                    </label>
                    <select
                        id="totalExperience"
                        name="totalExperience"
                        value={formData.totalExperience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-8">5-8 years</option>
                      <option value="8+">8+ years</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary (MAD/month)
                    </label>
                    <input
                        type="number"
                        id="expectedSalary"
                        name="expectedSalary"
                        min="0"
                        step="1000"
                        value={formData.expectedSalary}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 15000"
                    />
                  </div>

                  <div>
                    <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700 mb-2">
                      Available From
                    </label>
                    <input
                        type="date"
                        id="availableFrom"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-6">
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="JavaScript, React, Node.js, MongoDB, etc."
                  />
                </div>
              </div>

              {/* Education Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                      Highest Degree
                    </label>
                    <select
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select degree</option>
                      <option value="High School">High School</option>
                      <option value="Associate">Associate Degree</option>
                      <option value="Bachelor">Bachelor's Degree</option>
                      <option value="Master">Master's Degree</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                      University/Institution
                    </label>
                    <input
                        type="text"
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., University Mohammed V"
                    />
                  </div>

                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Year
                    </label>
                    <input
                        type="number"
                        id="graduationYear"
                        name="graduationYear"
                        min="1980"
                        max={new Date().getFullYear() + 10}
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 2023"
                    />
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>

                {/* Resume Upload */}
                <div className="mb-6">
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV <span className="text-red-500">*</span>
                  </label>
                  {uploadedFiles.resume ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm font-medium text-green-800">{uploadedFiles.resume}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeFile('resume')}
                            className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                  ) : (
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="resume" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload your resume</span>
                              <input
                                  id="resume"
                                  name="resume"
                                  type="file"
                                  required
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileChange}
                                  className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                        </div>
                      </div>
                  )}
                </div>

                {/* Portfolio Upload */}
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio (Optional)
                  </label>
                  {uploadedFiles.portfolio ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm font-medium text-green-800">{uploadedFiles.portfolio}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeFile('portfolio')}
                            className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                  ) : (
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="portfolio" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload portfolio</span>
                              <input
                                  id="portfolio"
                                  name="portfolio"
                                  type="file"
                                  accept=".pdf,.doc,.docx,.zip,.rar"
                                  onChange={handleFileChange}
                                  className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX, ZIP, RAR up to 5MB</p>
                        </div>
                      </div>
                  )}
                </div>
              </div>

              {/* Cover Letter Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter & Additional Information</h3>

                {/* Cover Letter */}
                <div className="mb-6">
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter <span className="text-gray-500">(Recommended - min. 50 characters)</span>
                  </label>
                  <textarea
                      id="coverLetter"
                      name="coverLetter"
                      rows="6"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Write a compelling cover letter explaining why you're the perfect fit for this role..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.coverLetter.length}/50 characters minimum
                  </p>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Website/Portfolio
                    </label>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                {/* Motivation */}
                <div className="mb-6">
                  <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to work for this company?
                  </label>
                  <textarea
                      id="motivation"
                      name="motivation"
                      rows="4"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Explain what attracts you to this company and role..."
                  />
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <input
                        id="relocate"
                        name="relocate"
                        type="checkbox"
                        checked={formData.relocate}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="relocate" className="ml-2 block text-sm text-gray-900">
                      Willing to relocate
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                        id="remoteWork"
                        name="remoteWork"
                        type="checkbox"
                        checked={formData.remoteWork}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remoteWork" className="ml-2 block text-sm text-gray-900">
                      Open to remote work
                    </label>
                  </div>
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Validation Errors:</h3>
                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                          {validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
              )}

              {/* Error Message */}
              {error && (
                  <div id="error-message" className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  </div>
              )}

              {/* Submit Section */}
              <div className="flex justify-between items-center pt-8">
                <button
                    type="button"
                    onClick={() => navigate(`/jobs/${id}`)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>

                <div className="flex space-x-4">
                  <button
                      type="submit"
                      disabled={submitting}
                      className={`px-8 py-3 ${
                          submitting
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                      } text-white font-medium rounded-md flex items-center`}
                  >
                    {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting Application...
                        </>
                    ) : (
                        'Submit Application'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Debug Information (Development Only) */}
        {debugMode && process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-50 border rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">🐛 Debug Information</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Job ID:</strong> {id}</p>
                <p><strong>User Role:</strong> {user?.role}</p>
                <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                <p><strong>Form Valid:</strong> {validationErrors.length === 0 ? 'Yes' : 'No'}</p>
                <p><strong>Resume Attached:</strong> {formData.resume ? 'Yes' : 'No'}</p>
                <p><strong>API Endpoint:</strong> /api/applications</p>
              </div>
            </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              Application Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Tailor your cover letter to this specific role</li>
              <li>• Highlight relevant skills from the job requirements</li>
              <li>• Keep your resume updated and error-free</li>
              <li>• Be honest about your experience and availability</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-medium text-green-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              What Happens Next?
            </h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>• Your application will be reviewed by the employer</li>
              <li>• You'll receive email notifications about status updates</li>
              <li>• If shortlisted, you'll be contacted for an interview</li>
              <li>• You can track your application status in your dashboard</li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default JobApplicationPage;