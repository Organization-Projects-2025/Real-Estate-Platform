import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.pathname.split('/').pop(); // Get token from URL

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        {
          password: formData.password,
          confirmPassword: formData.confirmPassword
        },
        { withCredentials: true }
      );

      if (response.data.status === 'success') {
        setMessage('Password has been successfully reset!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-[#121212] text-white min-h-screen">
        <Navbar />
        <div className="relative min-h-screen">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-xl mb-4">Invalid or expired reset link.</p>
              <button
                onClick={() => navigate('/forget-password')}
                className="text-[#703BF7] hover:text-[#5f2cc6] font-medium transition-colors duration-300"
              >
                Request a new reset link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Navbar />
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        />
        
        {/* Content */}
        <section className="relative flex items-center justify-center py-24 px-6 md:px-16">
          <div className="w-full max-w-md bg-[#1a1a1a] rounded-xl p-8 shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:shadow-[#703BF7]/20">
            <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-[#fff]">
              Reset Password
            </h2>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.includes('successfully') ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <p className={`text-center ${
                  message.includes('successfully') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-[#703BF7] transition-all duration-300"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-[#703BF7] transition-all duration-300"
                  placeholder="Confirm new password"
                  required
                />
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
                className={`w-full bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#703BF7]/30 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Resetting...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-[#703BF7] hover:text-[#5f2cc6] font-medium transition-colors duration-300"
              >
                Return to Login
              </button>
            </div>
          </div>
        </section>
      </div>
      <footer className="relative bg-[#1a1a1a] py-6 text-center text-gray-400">
        <p>© 2025 Tamalk. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ResetPassword;
