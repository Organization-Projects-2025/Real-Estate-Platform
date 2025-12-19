import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { v4 } from "uuid";
import { storage, ID } from '../../appwrite';
import { useAuth } from '../context/AuthContext';

const steps = ['Basic Info', 'Address & Area', 'Media & Price', 'Features'];

export default function Sell() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listingType: 'sale',
    propertyType: 'residential',
    subType: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
    },
    area: {
      sqft: '',
      sqm: '',
    },
    media: [],
    buildDate: '',
    price: '',
    status: 'active',
    user: '',
    features: {
      bedrooms: '',
      bathrooms: '',
      garage: '',
      pool: false,
      yard: false,
      pets: false,
      furnished: 'none',
      airConditioning: false,
      internet: false,
      electricity: false,
      water: false,
      gas: false,
      wifi: false,
      security: false,
    },
  });
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    'w-full p-4 bg-[#1a1a1a] text-white placeholder-gray-400 rounded-2xl shadow-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-600';
  const selectClass = inputClass;
  const fileButtonClass =
    'w-full p-4 bg-gradient-to-r from-purple-700 to-purple-400 text-white rounded-full border-2 border-purple-500 shadow-xl cursor-pointer text-center';
  const checkboxClass =
    'h-6 w-6 border-2 border-gray-600 rounded-lg checked:bg-gradient-to-r checked:from-purple-600 checked:to-purple-400';

  const handleChange = (e) => {
    const { name, type, files, value, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        features: { ...prev.features, [name]: checked },
      }));
    } else if (type === 'file') {
      if (!files || files.length === 0) {
        setUploadStatus({ error: 'Please select at least one file.' });
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSizeInMB = 5;
      const newFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = v4();

        if (!allowedTypes.includes(file.type)) {
          setUploadStatus((prev) => ({
            ...prev,
            [fileId]: { error: `File "${file.name}" is not an allowed image type.` },
          }));
          continue;
        }

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeInMB) {
          setUploadStatus((prev) => ({
            ...prev,
            [fileId]: { error: `File "${file.name}" exceeds the ${maxSizeInMB}MB limit.` },
          }));
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        newFiles.push({ file, previewUrl, fileId });
      }

      if (newFiles.length > 0) {
        setPendingFiles((prev) => [...prev, ...newFiles]);
        setUploadStatus((prev) => ({
          ...prev,
          success: `${newFiles.length} file(s) added for upload.`,
        }));
      }

      setTimeout(() => {
        setUploadStatus({});
      }, 5000);
    } else {
      const [field, subField] = name.split('.');
      if (subField) {
        setFormData((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: type === 'number' ? value : value,
          },
        }));
      } else if (['bedrooms', 'bathrooms', 'garage', 'furnished'].includes(name)) {
        setFormData((prev) => ({
          ...prev,
          features: {
            ...prev.features,
            [name]: type === 'number' ? value : value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: type === 'number' ? value : value,
        }));
      }
    }
  };

  const removePendingFile = (fileId) => {
    setPendingFiles((prev) => {
      const fileToRemove = prev.find((f) => f.fileId === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.fileId !== fileId);
    });
  };

  const next = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const back = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!isAuthenticated || !user) {
      setUploadStatus({ error: 'You must be logged in to submit a property.' });
      setTimeout(() => setUploadStatus({}), 5000);
      setIsSubmitting(false);
      return;
    }

    if (pendingFiles.length === 0) {
      setUploadStatus({ error: 'At least one image is required.' });
      setTimeout(() => setUploadStatus({}), 5000);
      setIsSubmitting(false);
      return;
    }

    let uploadedFiles = [];

    try {
      const uploadPromises = pendingFiles.map(({ file, fileId }) => {
        return new Promise(async (resolve, reject) => {
          try {
            setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
            setUploadStatus((prev) => ({ ...prev, [fileId]: { status: 'uploading' } }));

            const renamedFile = new File([file], `properties/${file.name}_${v4()}`, {
              type: file.type,
            });
            const response = await storage.createFile(
              '6828c071001e2d182ea9',
              ID.unique(),
              renamedFile,
              undefined,
              (event) => {
                const percent = Math.round((event.progress / event.size) * 100);
                setUploadProgress((prev) => ({ ...prev, [fileId]: percent }));
              }
            );

            const appwriteEndpoint = storage.client.config.endpoint;
            const viewUrl = `${appwriteEndpoint}/storage/buckets/6828c071001e2d182ea9/files/${response.$id}/view?project=${storage.client.config.project}`;
            if (!viewUrl) {
              throw new Error(`Failed to generate view URL for file: ${file.name}`);
            }
            setUploadStatus((prev) => ({
              ...prev,
              [fileId]: { success: `File "${file.name}" uploaded successfully.` },
            }));
            resolve(viewUrl);
          } catch (err) {
            console.error('Upload error:', err);
            setUploadStatus((prev) => ({
              ...prev,
              [fileId]: { error: `Failed to upload file: ${file.name}` },
            }));
            reject(err);
          }
        });
      });

      uploadedFiles = await Promise.all(uploadPromises);
    } catch (err) {
      setIsSubmitting(false);
      return;
    } finally {
      setTimeout(() => {
        setUploadProgress({});
        setUploadStatus((prev) => {
          const { success, error, ...fileStatuses } = prev;
          return fileStatuses;
        });
      }, 5000);
    }

    const payload = {
      ...formData,
      area: {
        sqft: Math.max(0, Number(formData.area.sqft) || 0),
        sqm: Math.max(0, Number(formData.area.sqm) || 0),
      },
      price: Math.max(0, Number(formData.price) || 0),
      features: {
        ...formData.features,
        bedrooms: Math.max(0, Number(formData.features.bedrooms) || 0),
        bathrooms: Math.max(0, Number(formData.features.bathrooms) || 0),
        garage: Math.max(0, Number(formData.features.garage) || 0),
      },
      media: uploadedFiles,
      user: user._id,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/properties', payload);
      setUploadStatus({ success: 'Property successfully listed!' });
      setPendingFiles([]);
      setTimeout(() => {
        navigate(`/property/${response.data.data.property._id}`);
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err.response?.data || err.message);
      setUploadStatus({
        error: `Error ${err.response?.status || 'Unknown'}: ${
          err.response?.data?.message || err.message
        }`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <input
              className={inputClass}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Listing Title"
            />
            <textarea
              className={`${inputClass} h-32`}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed Description"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <select
                className={selectClass}
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
              >
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
              <select
                className={selectClass}
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
              <input
                className={inputClass}
                name="subType"
                value={formData.subType}
                onChange={handleChange}
                placeholder="Sub-Type (e.g. Apartment)"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <input
              className={inputClass}
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Street Address"
            />
            <div className="grid md:grid-cols-3 gap-4">
              <input
                className={inputClass}
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                className={inputClass}
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
              />
              <input
                className={inputClass}
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className={inputClass}
                name="area.sqft"
                type="number"
                min="0"
                value={formData.area.sqft}
                onChange={handleChange}
                placeholder="Area (sqft)"
              />
              <input
                className={inputClass}
                name="area.sqm"
                type="number"
                min="0"
                value={formData.area.sqm}
                onChange={handleChange}
                placeholder="Area (sqm)"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="relative">
              <label className={fileButtonClass}>
                <input
                  className="hidden"
                  name="media"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleChange}
                />
                Choose Media Files
              </label>
            </div>
            {Object.keys(uploadStatus).length > 0 && (
              <div className="space-y-2">
                {Object.entries(uploadStatus).map(([key, status]) => (
                  key !== 'success' && key !== 'error' && (
                    <div
                      key={key}
                      className={`p-3 rounded-lg flex items-center gap-2 ${
                        status.success
                          ? 'bg-green-900/50 border border-green-500'
                          : status.error
                          ? 'bg-red-900/50 border border-red-500'
                          : 'bg-gray-900/50 border border-gray-500'
                      }`}
                    >
                      {status.success ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : status.error ? (
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      )}
                      <span className="text-sm">
                        {status.success || status.error || 'Uploading...'}
                      </span>
                      {uploadProgress[key] !== undefined && (
                        <div className="ml-auto w-24 h-2 bg-gray-700 rounded-full">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[key]}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
            {pendingFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-lg font-semibold mb-2">Selected Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {pendingFiles.map(({ previewUrl, fileId, file }, idx) => (
                    <div key={fileId} className="relative group">
                      <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                        <img
                          src={previewUrl}
                          alt={`Preview ${file.name}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-700"
                          onError={(e) => {
                            e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAEBgIJ6s3Y2QAAAABJRU5ErkJggg==';
                          }}
                          loading="lazy"
                        />
                      </div>
                      <button
                        onClick={() => removePendingFile(fileId)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <input
              className={inputClass}
              name="buildDate"
              type="date"
              value={formData.buildDate}
              onChange={handleChange}
            />
            <input
              className={inputClass}
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="Listing Price"
            />
            <select
              className={selectClass}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {['bedrooms', 'bathrooms', 'garage'].map((key) => (
                <input
                  key={key}
                  className={inputClass}
                  name={key}
                  type="number"
                  min="0"
                  value={formData.features[key]}
                  onChange={handleChange}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {['pool', 'yard', 'pets'].map((key) => (
                <label
                  key={key}
                  className="flex items-center p-4 bg-[#1a1a1a] rounded-2xl shadow-md cursor-pointer"
                >
                  <input
                    className={checkboxClass}
                    name={key}
                    type="checkbox"
                    checked={formData.features[key]}
                    onChange={handleChange}
                  />
                  <span className="ml-2 capitalize">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </label>
              ))}
              <select
                className={selectClass}
                name="furnished"
                value={formData.features.furnished}
                onChange={handleChange}
              >
                <option value="fully">Fully Furnished</option>
                <option value="partly">Partly Furnished</option>
                <option value="none">Unfurnished</option>
              </select>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                'airConditioning',
                'internet',
                'electricity',
                'water',
                'gas',
                'wifi',
                'security',
              ].map((key) => (
                <label
                  key={key}
                  className="flex items-center p-4 bg-[#1a1a1a] rounded-2xl shadow-md cursor-pointer"
                >
                  <input
                    className={checkboxClass}
                    name={key}
                    type="checkbox"
                    checked={formData.features[key]}
                    onChange={handleChange}
                  />
                  <span className="ml-2">
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .charAt(0)
                      .toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#121212] text-white w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-400">You must be logged in to list a property.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white w-full min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-white leading-[2]">
          List Your Property
        </h2>
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 relative">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx <= currentStep
                      ? 'bg-gradient-to-r from-purple-600 to-purple-300'
                      : 'bg-gray-700'
                  }`}
                />
                <span
                  className={`absolute -top-6 text-xs ${
                    idx <= currentStep ? 'text-purple-400' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
        {renderStep()}
        {(uploadStatus.success || uploadStatus.error) && (
          <div className="mt-6">
            <div
              className={`p-4 rounded-lg flex items-center gap-2 ${
                uploadStatus.success
                  ? 'bg-green-900/50 border border-green-500'
                  : 'bg-red-900/50 border border-red-500'
              }`}
            >
              {uploadStatus.success ? (
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-base font-medium">
                {uploadStatus.success || uploadStatus.error}
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-10">
          <button
            onClick={back}
            disabled={currentStep === 0}
            className="px-10 py-3 rounded-full bg-gray-700 text-gray-400 disabled:opacity-50 hover:bg-gray-600 transition"
          >
            Back
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              onClick={next}
              className="px-10 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-10 py-3 rounded-full flex items-center justify-center transition ${
                isSubmitting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting
                </>
              ) : (
                'Submit'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}