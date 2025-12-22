import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerService } from '../services/authService';
import Navbar from '../components/Navbar';

function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await registerService(formData);
      
      if (response.data && response.data.user) {
        // Set user in context immediately
        setUser(response.data.user);
        // Redirect immediately
        navigate('/');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      setSuccess(false);
      setMessage(error.response?.data?.message || error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Navbar />
      <section className="flex items-center justify-center py-24 px-6 md:px-16">
        <div className="w-full max-w-md bg-[#1a1a1a] rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-4 bg-[#252525] text-white placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-4 bg-[#252525] text-white placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-4 bg-[#252525] text-white placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-4 bg-[#252525] text-white placeholder-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-4 bg-[#252525] text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="user">Property User</option>
                <option value="developer">Property Developer</option>
              </select>
              <p className="text-xs text-gray-400">
                {formData.role === 'developer' 
                  ? 'As a developer, you can list and manage your own properties' 
                  : 'As a user, you can browse and inquire about properties'}
              </p>
            </div>
            <div className="text-sm text-gray-400">
              <p>Password must be at least 8 characters long and contain:</p>
              <ul className="list-disc list-inside mt-1">
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character</li>
              </ul>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white font-semibold shadow-xl transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          {message && (
            <p
              className={`text-center text-sm mt-4 ${
                success ? 'text-green-400' : 'text-red-500'
              }`}
            >
              {message}
            </p>
          )}
          <div className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="underline text-purple-400 hover:text-purple-300 transition"
            >
              Log In
            </button>
          </div>
        </div>
      </section>
      <footer className="bg-[#1a1a1a] py-6 text-center text-gray-400">
        <p>© 2025 Tamalk. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Register;
