import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

const formVariants = {
  initial: { opacity: 0, x: 100, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] },
  },
};

export default function BecomeAgent() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1 for login, 2 for agent form
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [agentData, setAgentData] = useState({
    firstName: '',
    lastName: '',
    contactEmail: '',
    phoneNumber: '',
    yearsOfExperience: 0,
    age: 18,
    totalSales: 0,
    about: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass =
    'w-full p-4 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#703BF7] transition-all duration-300';
  const buttonClass =
    'w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#703BF7] to-[#5f2cc6] text-white font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#703BF7]/30';

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgentChange = (e) => {
    const { name, value } = e.target;
    setAgentData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' || name === 'age' || name === 'totalSales' 
        ? Number(value) 
        : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Use the login function from auth context
      const response = await login(loginData.email.trim(), loginData.password);
      
      if (response.data.user.role === 'agent') {
        setMessage('You are already an agent!');
        setTimeout(() => {
          navigate('/agent');
        }, 2000);
      } else {
        // Pre-fill agent data with user info
        setAgentData(prev => ({
          ...prev,
          firstName: response.data.user.firstName || '',
          lastName: response.data.user.lastName || '',
          email: loginData.email,
          password: loginData.password,
          contactEmail: loginData.email // Pre-fill contact email with login email
        }));
        
        setStep(2);
        setMessage('');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create the agent data with all required fields
      const agentPayload = {
        firstName: agentData.firstName,
        lastName: agentData.lastName,
        email: agentData.email,
        password: agentData.password,
        user: agentData.email,
        contactEmail: agentData.contactEmail || agentData.email,
        phoneNumber: agentData.phoneNumber,
        yearsOfExperience: agentData.yearsOfExperience,
        age: agentData.age,
        totalSales: agentData.totalSales,
        about: agentData.about
      };

      const response = await axios.post(
        'http://localhost:3000/api/agents',
        agentPayload,
        {
          withCredentials: true // Important for cookie-based auth
        }
      );

      if (response.status === 201) {
        setMessage('Successfully became an agent!');
        setTimeout(() => {
          navigate('/agent');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          variants={formVariants}
          initial="initial"
          animate="animate"
          className="bg-[#1a1a1a] rounded-xl p-8 shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:shadow-[#703BF7]/20"
        >
          <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#703BF7] to-white mb-8">
            Become an Agent
          </h1>
          
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('Successfully') ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <p className={`text-center ${
                message.includes('Successfully') ? 'text-green-500' : 'text-red-500'
              }`}>
                {message}
              </p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <p className="text-center text-gray-400 text-sm mb-6">
                Please login to verify your account
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="Enter your email"
                    className={inputClass}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={buttonClass}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Account'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-center text-gray-400 text-sm mb-6">
                Fill out the form below to become an agent
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={agentData.firstName}
                    onChange={handleAgentChange}
                    placeholder="Enter your first name"
                    className={inputClass}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={agentData.lastName}
                    onChange={handleAgentChange}
                    placeholder="Enter your last name"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={agentData.contactEmail}
                    onChange={handleAgentChange}
                    placeholder="Enter your contact email"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={agentData.phoneNumber}
                    onChange={handleAgentChange}
                    placeholder="Enter your phone number"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={agentData.age}
                    onChange={handleAgentChange}
                    placeholder="Enter your age"
                    className={inputClass}
                    required
                    min="18"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={agentData.yearsOfExperience}
                    onChange={handleAgentChange}
                    placeholder="Enter years of experience"
                    className={inputClass}
                    required
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Total Sales</label>
                <input
                  type="number"
                  name="totalSales"
                  value={agentData.totalSales}
                  onChange={handleAgentChange}
                  placeholder="Enter total sales"
                  className={inputClass}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">About</label>
                <textarea
                  name="about"
                  value={agentData.about}
                  onChange={handleAgentChange}
                  placeholder="Tell us about yourself and your experience in real estate"
                  className={`${inputClass} h-32 resize-none`}
                />
              </div>

              <button 
                type="submit" 
                className={buttonClass}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Become an Agent'
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/agent')}
              className="text-[#703BF7] hover:text-[#5f2cc6] transition-colors duration-300"
            >
              Back to Agents
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 

