import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const CreateAgent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactEmail: '',
    phoneNumber: '',
    yearsOfExperience: 0,
    age: 18,
    totalSales: 0,
    about: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' || name === 'age' || name === 'totalSales' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const agentPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        contactEmail: formData.contactEmail || formData.email,
        phoneNumber: formData.phoneNumber,
        yearsOfExperience: formData.yearsOfExperience,
        age: formData.age,
        totalSales: formData.totalSales,
        about: formData.about,
        user: formData.email
      };

      const response = await axios.post('http://localhost:3000/api/agents', agentPayload);
      
      if (response.data.status === 'success') {
        navigate('/agent');
      } else {
        setError(response.data.message || 'Failed to create agent');
      }
    } catch (err) {
      console.error('Error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121212] text-[#fff] min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Create New Agent Profile</h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#1a1a1a] p-8 rounded-xl">
          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#703BF7]">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="18"
                  max="100"
                  className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                  min="0"
                  max="50"
                  className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#703BF7]">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Total Sales</label>
                <input
                  type="number"
                  name="totalSales"
                  value={formData.totalSales}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 bg-[#252525] rounded-lg focus:ring-2 focus:ring-[#703BF7] outline-none"
                placeholder="Tell us about yourself and your experience..."
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#703BF7] text-white py-3 rounded-lg hover:bg-[#5f2cc6] transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Agent Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgent;

